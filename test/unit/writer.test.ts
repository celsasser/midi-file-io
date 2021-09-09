/**
 * User: curtis
 * Date: 2019-01-20
 * Time: 15:05
 */

import * as assert from "assert";
import * as fs from "fs";
import {parseMidiBuffer, writeMidiToBuffer, writeMidiToFile} from "../../src";

function compareBuffers(read: string, write: Buffer): void {
	/* eslint-disable no-console */
	try {
		assert.strictEqual(write.toString("binary"), read.toString());
	} catch(error) {
		console.info("read and write buffers do not match");
		console.info("index  r   w ");
		for(let index=0; index<write.length; index++) {
			let rc=read.charCodeAt(index),
				wc=write[index],
				prefix=`${((rc===wc) ? " " : "*")}${index}`;
			console.info(`${format(prefix, 4)} ${format(rc.toString(16), 3)} ${format(wc.toString(16), 3)}  [${read[index]}]`);
		}
		throw error;
	}
}

/**
 * Formats value with options
 * @param {*} value
 * @param {number} minWidth
 */
function format(value: unknown, minWidth=0): string {
	let text: string = (value==null)
		? String(value)
		: value.toString();
	while(text.length<minWidth) {
		text=` ${text}`;
	}
	return text;
};

describe("lib.writer", function() {
	describe("writeMidiToBuffer", function() {
		it("should properly load and parse 'simple.mid'", function() {
			const readBuffer=fs.readFileSync("./test/data/simple.mid", {encoding: "binary"}),
				parsed=parseMidiBuffer(readBuffer),
				writeBuffer=writeMidiToBuffer(parsed);
			compareBuffers(readBuffer, writeBuffer);
		});
	});

	describe("writeMidiToFile", function() {
		it("should properly load and parse 'simple.mid'", function() {
			const readBuffer=fs.readFileSync("./test/data/simple.mid", {encoding: "binary"}),
				parsed=parseMidiBuffer(readBuffer);
			writeMidiToFile(parsed, "./test/data/out.mid");
			compareBuffers(readBuffer, fs.readFileSync("./test/data/out.mid", {encoding: "binary"}) as unknown as Buffer);
		});
	});
});

