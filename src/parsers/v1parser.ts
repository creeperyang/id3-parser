import GENRES from '../constants/genres';
import { IBytes, IID3V1Tag } from '../interface';
import { readBytesToUTF8 } from '../utils';

const V1_MIN_LENGTH = 128;

/**
 * Parse ID3v1 metadata from binary bytes.
 * @description
 * ID3v1 tag occupies 128 bytes, beginning with the string TAG 128 bytes
 * from the end of the file.
 *
 * And the format is like: header(3) + title(30) + artist(30) +
 * album(30) + year(4) + comment(30) + genre(1).
 *
 * And extended tag is only supported by few programs, so we ignore it.
 * @param bytes binary bytes.
 */
export default function parseV1Data(bytes: IBytes): false | IID3V1Tag {
    if (!bytes || bytes.length < V1_MIN_LENGTH) {
        return false;
    }

    bytes = bytes.slice(bytes.length - V1_MIN_LENGTH);

    const tags: IID3V1Tag = {
        version: {
            major: 1,
            minor: 0,
        },
    };
    const flag = readBytesToUTF8(bytes, 3);
    if (flag !== 'TAG') {
        return false;
    }
    // Strings are either space- or zero-padded. So remove them.
    const reWhiteSpace = /(^[\s0]+|[\s0]+$)/;
    tags.title = readBytesToUTF8(bytes.slice(3), 30).replace(reWhiteSpace, '');
    tags.artist = readBytesToUTF8(bytes.slice(33), 30).replace(reWhiteSpace, '');
    tags.album = readBytesToUTF8(bytes.slice(63), 30).replace(reWhiteSpace, '');
    tags.year = readBytesToUTF8(bytes.slice(93), 4).replace(reWhiteSpace, '');

    // If there is a zero byte at [125], the comment is 28 bytes and the remaining 2 are [0, trackno]
    if (bytes[125] === 0) {
        tags.comments = readBytesToUTF8(bytes.slice(97), 28).replace(reWhiteSpace, '');
        tags.version.minor = 1;
        tags.track = bytes[126];
    } else {
        tags.comments = readBytesToUTF8(bytes.slice(97), 30).replace(reWhiteSpace, '');
    }
    tags.genre = GENRES[bytes[127]] || '';

    return tags;
}
