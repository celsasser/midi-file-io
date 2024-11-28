import {MidiIoSong} from "./types";
import {WriteStream} from "node:tty";

export function dumpMidiSong(song:MidiIoSong, stream: WriteStream = process.stdout): void {
    stream.write(JSON.stringify(song, null, 3));
}