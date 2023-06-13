import * as assert from 'assert';
import { readBytesToISO8859, readBytesToUTF16, readBytesToUTF8 } from '../src/bytesUtil';

describe('Test util lib.', () => {
    describe('#readBytesToUTF8', () => {
        it('should convert bytes of ascii chars successfully.', () => {
            assert.equal(
                readBytesToUTF8([50]),
                '2',
            );
            assert.equal(
                readBytesToUTF8([50, 51, 52]),
                '234',
            );
            assert.equal(
                readBytesToUTF8([50, 51, 52, 97, 98, 99, 65, 66, 67]),
                '234abcABC',
            );
        });
        const expectedStr = '12hi我你他。#繁體囄Д𝌆';
        it('should convert bytes of complex string successfully.', () => {
            assert.equal(
                readBytesToUTF8(Buffer.from(expectedStr, 'utf8')),
                expectedStr,
            );
        });
        it('should support specify how many bytes to read and wont break chars.', () => {
            assert.equal(
                readBytesToUTF8(Buffer.from(expectedStr, 'utf8'), 10),
                '12hi我你',
            );
            assert.equal(
                readBytesToUTF8(Buffer.from(expectedStr, 'utf8'), 11),
                '12hi我你他',
            );
        });
        it('should support specify invalid bytes length to read.', () => {
            assert.equal(
                readBytesToUTF8(Buffer.from(expectedStr, 'utf8'), 0),
                '',
            );
            assert.equal(
                readBytesToUTF8(Buffer.from(expectedStr, 'utf8'), -1),
                expectedStr,
            );
            assert.equal(
                readBytesToUTF8(Buffer.from(expectedStr, 'utf8'), 1024),
                expectedStr,
            );
        });
    });
    describe('#readBytesToUTF16', () => {
        it('should convert bytes of ascii chars successfully.', () => {
            assert.equal(
                readBytesToUTF16([0x32, 0x00], false),
                '2',
            );
            assert.equal(
                readBytesToUTF16([0x32, 0x00, 0x33, 0x00, 0x34, 0x00], false),
                '234',
            );
            assert.equal(
                readBytesToUTF16([0x61, 0x00, 0x62, 0x00, 0x63, 0x00], false),
                'abc',
            );
        });
        it('should support big endian.', () => {
            assert.equal(
                readBytesToUTF16([0xD8, 0x34, 0xDF, 0x06], true),
                '𝌆',
            );
        });
        const expectedStr = '12hi我你他。#繁體囄Д𐐷𝌆';
        it('should convert bytes of complex string successfully.', () => {
            assert.equal(
                readBytesToUTF16(Buffer.from(expectedStr, 'utf16le')),
                expectedStr,
            );
        });
        it('should support specify how many bytes to read and wont break chars.', () => {
            assert.equal(
                readBytesToUTF16(Buffer.from(expectedStr, 'utf16le'), false, 11),
                '12hi我你',
            );
            assert.equal(
                readBytesToUTF16(Buffer.from(expectedStr, 'utf16le'), false, 13),
                '12hi我你他',
            );
        });
        it('should support specify invalid bytes length to read.', () => {
            assert.equal(
                readBytesToUTF16(Buffer.from(expectedStr, 'utf16le'), false, 0),
                '',
            );
            assert.equal(
                readBytesToUTF16(Buffer.from(expectedStr, 'utf16le'), false, -1),
                expectedStr,
            );
            assert.equal(
                readBytesToUTF16(Buffer.from(expectedStr, 'utf16le'), false, 1024),
                expectedStr,
            );
        });
    });
    describe('#readBytesToISO8859', () => {
        it('should convert bytes of ascii chars successfully.', () => {
            assert.equal(
                readBytesToISO8859([50]),
                '2',
            );
            assert.equal(
                readBytesToISO8859([50, 51, 52]),
                '234',
            );
            assert.equal(
                readBytesToISO8859([50, 51, 52, 97, 98, 99, 65, 66, 67]),
                '234abcABC',
            );
        });
        const expectedStr = '12hi我你他';
        it('should fail to convert bytes beyound ascii.', () => {
            assert.notEqual(
                readBytesToISO8859(Buffer.from(expectedStr, 'utf8')),
                expectedStr,
            );
        });
    });
});
