/**
 * User: curtis
 * Date: 2024-11-27
 */

import {dumpMidiSong, parseMidiFile} from "../../src";

describe("lib.dumper", function() {
    describe("dumpMidiSong", function() {
        it('should dump to stdout by default', () => {
            const parsed=parseMidiFile("./test/data/simple.mid");
            dumpMidiSong(parsed);
        });
    });
});

