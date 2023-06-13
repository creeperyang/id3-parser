import * as assert from 'assert';
import { readFileSync } from 'fs';
import parse from '../src/index';
import { IID3Tag, IID3V2Tag } from '../src/interface';
import parseV1 from '../src/parsers/v1parser';
import parseV2 from '../src/parsers/v2parser';
import expectedV1Meta from './expected/v1';
import expectedMeta from './expected/v2';
import expectedV23Meta from './expected/v3';

describe('Test v1parser lib.', () => {
    const buffer1 = readFileSync(`${__dirname}/test-v1-v2.3.mp3`);
    const buffer2 = readFileSync(`${__dirname}/test-no-v1.mp3`);
    it('should parse id3v1 successfully.', () => {
        const v1 = parseV1(buffer1);
        assert.deepEqual(v1, expectedV1Meta);
    });
    it('should recognize no id3v1 successfully.', () => {
        const v1 = parseV1(buffer2);
        assert.equal(v1, false);
    });
    it('should parse id3v2 successfully.', () => {
        const v2 = parseV2(buffer1) as IID3V2Tag;
        const imgData = v2.image!.data;
        delete v2.image!.data;
        assert.deepEqual(v2, expectedV23Meta);
        assert.deepEqual(imgData, readFileSync(
            `${__dirname}/expected/cover2.jpg`,
        ));
    });
    it('should parse id3 tag successfully.', () => {
        const meta = parse(buffer2) as IID3Tag;
        const imgData = meta.image!.data;
        delete meta.image!.data;
        assert.deepEqual(meta, expectedMeta);
        assert.deepEqual(imgData, readFileSync(
            `${__dirname}/expected/cover.jpg`,
        ));
    });
});
