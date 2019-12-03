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
	Independent =2
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
	FormatType: MidiFileType,
	TrackCount: number,
	TicksPerQuarter: number
}

export interface MidiIoEvent {
	amount?: number,
	channel?: number,
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

