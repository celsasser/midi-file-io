/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 15:02
 */

import {mkdirSync, writeFileSync} from "fs";
import {parse as parsePath} from "path";
import {WriteStream} from "./stream/write";
import {
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoEventType,
	MidiIoSong,
	MidiIoTrack
} from "./types";

/**
 * Maps midi code to the actual number of frames
 */
const frameCodeMap: {[index: number]: number} = {
	24: 0,
	25: 1,
	29: 2,
	30: 3
};


export function writeMidiToBuffer(midiData: MidiIoSong): Buffer {
	function writeChunk(stream: WriteStream, id:string, data: Buffer|WriteStream) {
		stream.write(id);
		stream.writeInt32(data.length);
		stream.write(data);
	}

	function writeHeader(stream: WriteStream) {
		const data = new WriteStream();
		data.writeInt16(midiData.header.formatType);
		data.writeInt16(midiData.tracks.length);
		data.writeInt16(midiData.header.ticksPerQuarter);
		writeChunk(stream, "MThd", data);
	}

	/**
	 * todo: implement running status if you find this and can't stop yourself
	 */
	function writeTrack(stream: WriteStream, track:MidiIoTrack): void {
		const trackStream = new WriteStream();

		function writeEvent(event: MidiIoEvent): void {
			function writeChannelData() {
				switch(event.subtype) {
					case MidiIoEventSubtype.NoteOff: {
						trackStream.writeInt8(0x80 | event.channel);
						trackStream.writeInt8(event.noteNumber);
						trackStream.writeInt8(event.velocity);
						break;
					}
					case MidiIoEventSubtype.NoteOn: {
						trackStream.writeInt8(0x90 | event.channel);
						trackStream.writeInt8(event.noteNumber);
						trackStream.writeInt8(event.velocity);
						break;
					}
					case MidiIoEventSubtype.NoteAftertouch: {
						trackStream.writeInt8(0x0a | event.channel);
						trackStream.writeInt8(event.noteNumber);
						trackStream.writeInt8(event.amount);
						break;
					}
					case MidiIoEventSubtype.Controller: {
						trackStream.writeInt8(0x0b | event.channel);
						trackStream.writeInt8(event.controllerType);
						trackStream.writeInt8(event.value);
						break;
					}
					case MidiIoEventSubtype.ProgramChange: {
						trackStream.writeInt8(0x0c | event.channel);
						trackStream.writeInt8(event.programNumber);
						break;
					}
					case MidiIoEventSubtype.ChannelAftertouch: {
						trackStream.writeInt8(0x0d | event.channel);
						trackStream.writeInt8(event.amount);
						break;
					}
					case MidiIoEventSubtype.PitchBend: {
						trackStream.writeInt8(0x0e | event.channel);
						trackStream.writeInt8(event.value & 0x7f);
						trackStream.writeInt8(event.value >> 7);
						break;
					}
					default: {
						throw new Error(`unrecognised MIDI event : ${event.subtype}`);
					}
				}
			}

			function writeMetaData(): void {
				function _writeText(subType: number) {
					const text = event.text || "";
					trackStream.writeInt8(subType);
					trackStream.writeVarInt(text.length);
					trackStream.write(text);
				}

				// write metadata's status byte
				trackStream.writeInt8(0xff);
				switch(event.subtype) {
					case MidiIoEventSubtype.SequenceNumber: {
						trackStream.writeInt8(0x00);
						trackStream.writeVarInt(2);
						trackStream.writeInt16(event.number);
						break;
					}
					case MidiIoEventSubtype.Text: {
						_writeText(0x01);
						break;
					}
					case MidiIoEventSubtype.CopyrightNotice: {
						_writeText(0x02);
						break;
					}
					case MidiIoEventSubtype.TrackName: {
						_writeText(0x03);
						break;
					}
					case MidiIoEventSubtype.InstrumentName: {
						_writeText(0x04);
						break;
					}
					case MidiIoEventSubtype.Lyrics: {
						_writeText(0x05);
						break;
					}
					case MidiIoEventSubtype.Marker: {
						_writeText(0x06);
						break;
					}
					case MidiIoEventSubtype.CuePoint: {
						_writeText(0x07);
						break;
					}
					case MidiIoEventSubtype.MidiChannelPrefix: {
						trackStream.writeInt8(0x20);
						trackStream.writeVarInt(1);
						trackStream.writeInt8(event.channel);
						break;
					}
					case MidiIoEventSubtype.EndOfTrack: {
						trackStream.writeInt8(0x2f);
						trackStream.writeVarInt(0);
						break;
					}
					case MidiIoEventSubtype.SetTempo: {
						trackStream.writeInt8(0x51);
						trackStream.writeVarInt(3);
						trackStream.writeInt8(event.microsecondsPerBeat >> 16 & 0xff);
						trackStream.writeInt8(event.microsecondsPerBeat >> 8 & 0xff);
						trackStream.writeInt8(event.microsecondsPerBeat & 0xff);
						break;
					}
					case MidiIoEventSubtype.SmpteOffset: {
						const frameCode = frameCodeMap[event.frameRate];
						trackStream.writeInt8(0x54);
						trackStream.writeVarInt(5);
						trackStream.writeInt8(event.hour | frameCode << 5);
						trackStream.writeInt8(event.min);
						trackStream.writeInt8(event.sec);
						trackStream.writeInt8(event.frame);
						trackStream.writeInt8(event.subframe);
						break;
					}
					case MidiIoEventSubtype.TimeSignature: {
						trackStream.writeInt8(0x58);
						trackStream.writeVarInt(4);
						trackStream.writeInt8(event.numerator);
						trackStream.writeInt8(Math.log2(event.denominator));
						trackStream.writeInt8(event.metronome);
						trackStream.writeInt8(event.thirtyseconds);
						break;
					}
					case MidiIoEventSubtype.KeySignature: {
						trackStream.writeInt8(0x59);
						trackStream.writeVarInt(2);
						trackStream.writeInt8(event.key);
						trackStream.writeInt8(event.scale);
						break;
					}
					case MidiIoEventSubtype.SequencerSpecific: {
						trackStream.writeInt8(0x7f);
						trackStream.writeVarInt(event.data.length);
						trackStream.write(event.data);
						break;
					}
					default: {
						throw new Error(`unknown channel event: ${event.subtype}`);
					}
				}
			}

			function writeSysexData() {
				throw new Error("sysex not supported yet");
			}

			// write the event's delta offset
			trackStream.writeVarInt(event.deltaTime);
			if(event.type === MidiIoEventType.Channel) {
				writeChannelData();
			} else if(event.type === MidiIoEventType.Meta) {
				writeMetaData();
			} else if(event.type === MidiIoEventType.SysEx) {
				writeSysexData();
			}
		}

		track.forEach(writeEvent.bind(null));
		writeChunk(stream, "MTrk", trackStream);
	}

	const stream = new WriteStream();
	writeHeader(stream);
	midiData.tracks.forEach(writeTrack.bind(null, stream));
	return stream.buffer;
}

/**
 * @throws {Error}
 */
export function writeMidiToFile(midiData: MidiIoSong, filePath: string): void {
	const buffer = writeMidiToBuffer(midiData);
	if(/.mid$/i.test(filePath) === false) {
		filePath += ".mid";
	}
	mkdirSync(parsePath(filePath).dir, {recursive: true});
	writeFileSync(filePath, buffer, {encoding: "binary"});
}
