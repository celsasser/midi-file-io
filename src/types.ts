/**
 * User: curtis
 * Date: 10/31/18
 * Time: 1:48 AM
 */

export enum MidiFileType {
	/**
	 * contains a single track
	 */
	Single = 0,
	/**
	 * contains one or more simultaneous (as in played simultaneously) tracks
	 */
	Simultaneous = 1,
	/**
	 * contains one or more independent (as in played independently) tracks
	 */
	Independent = 2
}

export type MidiChannelType = |0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15;
/**
 * Number of sharps or flats
 * -7 = 7 flats
 *  0 = key of C
 * +7 = 7 sharps
 */
export type MidiSharpFlatCount = -7|-6|-5|-4|-3|-2|-1|0|1|2|3|4|5|6|7;
/**
 * 0 = Major
 * 1 - Minor
 */
export type MidiScaleMode = 0|1;

export interface MidiKeySignature {
	key: MidiSharpFlatCount;
	scale: MidiScaleMode;
}

export enum MidiIoEventType {
	Channel = "channel",
	Meta = "meta",
	SysEx = "sysEx",
	DividedSysEx = "dividedSysEx"
}

export enum MidiIoEventSubtype {
	ChannelAftertouch = "channelAftertouch",
	Controller = "controller",
	CopyrightNotice = "copyrightNotice",
	CuePoint = "cuePoint",
	EndOfTrack = "endOfTrack",
	InstrumentName = "instrumentName",
	KeySignature = "keySignature",
	Lyrics = "lyrics",
	Marker = "marker",
	MidiChannelPrefix = "midiChannelPrefix",
	NoteAftertouch = "noteAftertouch",
	NoteOff = "noteOff",
	NoteOn = "noteOn",
	PitchBend = "pitchBend",
	ProgramChange = "programChange",
	SetTempo = "setTempo",
	SequenceNumber = "sequenceNumber",
	SequencerSpecific = "sequencerSpecific",
	SmpteOffset = "smpteOffset",
	TimeSignature = "timeSignature",
	TrackName = "trackName",
	Text = "text",
	Unknown = "unknown"
}

export interface MidiIoHeader {
	formatType: MidiFileType,
	trackCount: number,
	ticksPerQuarter: number
}

export interface MidiIoEvent {
	amount?: number,
	channel?: MidiChannelType,
	controllerType?: number,
	data?: string,
	deltaTime: number,
	denominator?: number,
	hour?: number,
	frame?: number,
	frameRate?: number,
	key?: number,
	metronome?: number,
	microsecondsPerBeat?: number,
	min?: number,
	noteNumber?: number,
	number?: number,
	numerator?: number,
	programNumber?: number,
	scale?: number,
	sec?: number,
	subframe?: number,
	subtype: MidiIoEventSubtype,
	text?: string,
	thirtyseconds?: number,
	type: MidiIoEventType,
	value?: number,
	velocity?: number
}

export interface MidiIoSong {
	header: MidiIoHeader,
	tracks: MidiIoTrack[]
}

export type MidiIoTrack = MidiIoEvent[];

