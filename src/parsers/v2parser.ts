import FARME_TYPES from '../constants/frameTypes';
import GENRES from '../constants/genres';
import IMAGE_TYPES from '../constants/imageTypes';
import { IBytes, IID3V2Tag, IV2VersionInfo } from '../interface';
import { readBytesToISO8859, readBytesToString, readBytesToUTF8 } from '../utils';

const V2_MIN_LENGTH = 20; // TAG HEADER(10) + ONE FRAME HEADER(10)

export default function parseV2Data(bytes: IBytes) {
    if (!bytes || bytes.length < V2_MIN_LENGTH) {
        return false;
    }
    const tags = parseV2Header(bytes.slice(0, 10));
    if (!tags) {
        return false;
    }
    const flags = tags.version.flags;

    // Currently do not support unsynchronisation
    if (flags.unsync) {
        throw new Error('no support for unsynchronisation');
    }

    let headerSize = 10;
    // Increment the header size if an extended header exists.
    if (flags.xheader) {
        // Usually extended header size is 6 or 10 bytes
        headerSize += calcTagSize(bytes.slice(10, 14));
    }

    const tagSize = calcTagSize(bytes.slice(6, 10));
    parseV2Frames(bytes.slice(headerSize, tagSize + headerSize), tags);
    return tags;
}

/**
 * Parse ID3v2 tag header.
 * @description
 * A typical ID3v2 tag (header) is like:
 * $49 44 33 yy yy xx zz zz zz zz
 *
 * Where yy is less than $FF, xx is the 'flags' byte and zz is less than $80.
 * @param bytes binary bytes.
 */
function parseV2Header(bytes: IBytes) {
    if (!bytes || bytes.length < 10) {
        return false;
    }

    const identity = readBytesToUTF8(bytes, 3);
    if (identity !== 'ID3') {
        return false;
    }

    const flagByte = bytes[5];
    const version: IV2VersionInfo = {
        major: 2,
        minor: bytes[3],
        revision: bytes[4],
        flags: {
            unsync: (flagByte & 0x80) !== 0, // Unsynchronisation
            xheader: (flagByte & 0x40) !== 0, // Extended header
            experimental: (flagByte & 0x20) !== 0, // Experimental indicator
        },
    };

    return { version };
}

/**
 * Calculate the total tag size, but excluding the header size(10 bytes).
 * @param bytes binary bytes.
 */
export function calcTagSize(bytes: IBytes): number {
    return (bytes[0] & 0x7f) * 0x200000 +
        (bytes[1] & 0x7f) * 0x4000 +
        (bytes[2] & 0x7f) * 0x80 +
        (bytes[3] & 0x7f);
}

/**
 * Calculate frame size (just content size, exclude 10 bytes header size).
 * @param bytes binary bytes.
 */
export function calcFrameSize(bytes: IBytes): number {
    return bytes.length < 4 ? 0 : bytes[0] * 0x1000000 +
        bytes[1] * 0x10000 +
        bytes[2] * 0x100 +
        bytes[3];
}

function parseV2Frames(bytes: IBytes, tags: IID3V2Tag) {
    let position = 0;
    const version = tags.version;

    while (position < bytes.length) {
        const size = calcFrameSize(bytes.slice(position + 4));
        // the left data would be '\u0000\u0000...', just a padding
        if (size === 0) {
            break;
        }
        // * < v2.3, frame ID is 3 chars, size is 3 bytes making a total size of 6 bytes
        // * >= v2.3, frame ID is 4 chars, size is 4 bytes, flags are 2 bytes, total 10 bytes
        const slice = bytes.slice(position, position + 10 + size);
        if (!slice.length) {
            break;
        }
        const frame = parseFrame(slice, version.minor, size);
        if (frame.tag) {
            tags[frame.tag] = frame.value;
        }
        position += slice.length;
    }
}

function parseFrame(bytes: IBytes, minor: number, size: number) {
    const result = {
        tag: null as string | null,
        value: null as string | object | null,
    };
    const header = {
        id: readBytesToUTF8(bytes, 4),
        type: null as string | null,
        size,
        flags: [
            bytes[8],
            bytes[9],
        ],
    };
    header.type = header.id[0];

    if (minor === 4) {
        // TODO: parse v2.4 frame
    }

    // No support for compressed, unsychronised, etc frames
    if (header.flags[1] !== 0) {
        return result;
    }
    if (!(header.id in FARME_TYPES)) {
        return result;
    }
    result.tag = FARME_TYPES[header.id];

    let encoding = 0;
    let variableStart = 0;
    let variableLength = 0;
    let i = 0;
    // Text information frames
    // allows different types of text encoding, So the next byte (bytes[10]) represents encoding.
    // 00 <---> ISO-8859-1 (ASCII), default encoding, represented as <text string>/<full text string>
    // 01 <---> UCS-2 encoded Unicode with BOM.
    // 02 <---> UTF-16BE encoded Unicode without BOM.
    // 03 <---> UTF-8 encoded Unicode.
    // The 3 above represented as <text string according to encoding>/<full text string according to encoding>
    if (header.type === 'T') {
        encoding = bytes[10];
        // If is User defined text information frame (TXXX), then bytes[11]
        // is Description (00): represented as a terminated string.
        const offset = header.id === 'TXXX' ? 12 : 11;
        result.value = readBytesToString(bytes.slice(offset), encoding);
        // Specially handle the 'Content type'.
        if (header.id === 'TCON' && result.value !== null) {
            if (result.value[0] === '(') {
                const handledTCON = result.value.match(/\(\d+\)/g);
                if (handledTCON) {
                    result.value = handledTCON.map(
                        (v: string) => GENRES[+v.slice(1, -1)],
                    ).join(',');
                }
            } else {
                const genre = parseInt(result.value, 10);
                if (!isNaN(genre)) {
                    result.value = GENRES[genre];
                }
            }
        }
    }
    // URL link frames
    // Always encoded as ISO-8859-1.
    else if (header.type === 'W') {
        // User defined URL link frame
        if (header.id === 'WXXX' && bytes[10] === 0) {
            result.value = readBytesToISO8859(bytes.slice(11));
        } else {
            result.value = readBytesToISO8859(bytes.slice(10));
        }
    }
    // Comments or Unsychronized lyric/text transcription.
    else if (header.id === 'COMM' || header.id === 'USLT') {
        encoding = bytes[10];
        variableStart = 14;
        variableLength = 0;

        // Skip the comment description and retrieve only the comment its self
        for (i = variableStart; ; i++) {
            if (encoding === 1 || encoding === 2) {
                if (bytes[i] === 0 && bytes[i + 1] === 0) {
                    variableStart = i + 2;
                    break;
                }
                i++;
            } else {
                if (bytes[i] === 0) {
                    variableStart = i + 1;
                    break;
                }
            }
        }
        result.value = readBytesToString(bytes.slice(variableStart), encoding);
    }
    /**
     * Attached picture frame, format is:
     * <Header for 'Attached picture', ID: "APIC">
     *  Text encoding   $xx
     *  MIME type       <text string> $00
     *  Picture type    $xx
     *  Description     <text string according to encoding> $00 (00)
     *  Picture data    <binary data>
     */
    else if (header.id === 'APIC') {
        encoding = bytes[10];
        const image = {
            type: null as string | null,
            mime: null as string | null,
            description: null as string | null,
            data: null as ArrayLike<number> | null,
        };
        variableStart = 11;
        variableLength = 0;
        for (i = variableStart; ; i++) {
            if (bytes[i] === 0) {
                variableLength = i - variableStart;
                break;
            }
        }
        // MIME is always encoded as ISO-8859.
        image.mime = readBytesToString(bytes.slice(variableStart), 0, variableLength);
        image.type = IMAGE_TYPES[bytes[variableStart + variableLength + 1]] || 'other';
        // Skip $00 and $xx(Picture type).
        variableStart += variableLength + 2;
        variableLength = 0;
        for (i = variableStart; ; i++) {
            if (bytes[i] === 0) {
                variableLength = i - variableStart;
                break;
            }
        }
        image.description = variableLength === 0
            ? null
            : readBytesToString(bytes.slice(variableStart), encoding, variableLength);
        variableStart += variableLength + 1;
        // check $00 at start of the image binary data
        for (i = variableStart; ; i++) {
            if (bytes[i] === 0) {
                variableStart++;
            } else {
                break;
            }
        }
        image.data = bytes.slice(variableStart);
        result.value = image;
    }
    else {
        // Do nothing to other frames.
    }
    return result;
}
