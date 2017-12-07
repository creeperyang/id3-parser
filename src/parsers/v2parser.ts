import FARME_TYPES, { FrameTypeValueMap } from '../constants/frameTypes';
import GENRES from '../constants/genres';
import IMAGE_TYPES from '../constants/imageTypes';
import { IBytes, IID3V2Tag, ITXXXMap, IV2VersionInfo } from '../interface';
import { getEndpointOfBytes, readBytesToISO8859, readBytesToString, readBytesToUTF8, skipPaddingZeros } from '../utils';

const V2_MIN_LENGTH = 20; // TAG HEADER(10) + ONE FRAME HEADER(10)

export default function parseV2Data(bytes: IBytes): false | IID3V2Tag {
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
            if (FrameTypeValueMap[frame.id as string] === 'array') {
                if (tags[frame.tag]) {
                    tags[frame.tag].push(frame.value);
                } else {
                    tags[frame.tag] = [frame.value];
                }
            } else {
                tags[frame.tag] = frame.value;
            }
        }
        position += slice.length;
    }
}

/**
 * Parse id3 frame.
 * @description
 * Declared ID3v2 frames are of different types:
 * 1. Unique file identifier
 * 2. Text information frames
 * 3. ...
 *
 * For frames that allow different types of text encoding, the first byte after header (bytes[10])
 * represents encoding. Its value is of:
 * 1. 00 <---> ISO-8859-1 (ASCII), default encoding, represented as <text string>/<full text string>
 * 2. 01 <---> UCS-2 encoded Unicode with BOM.
 * 3. 02 <---> UTF-16BE encoded Unicode without BOM.
 * 4. 03 <---> UTF-8 encoded Unicode.
 *
 * And 2-4 represented as <text string according to encoding>/<full text string according to encoding>
 * @param bytes Binary bytes.
 * @param minor Minor version, 2/3/4
 * @param size Frame size.
 */
function parseFrame(bytes: IBytes, minor: number, size: number) {
    const result = {
        id: null as string | null,
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
    result.id = header.id;

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
    /**
     * Text information frames, structure is:
     * <Header for 'Text information frame', ID: "T000" - "TZZZ", excluding "TXXX">
     * Text encoding    $xx
     * Information    <text string according to encoding>
     */
    if (header.type === 'T') {
        encoding = bytes[10];
        // If is User defined text information frame (TXXX), then we should handle specially.
        // <Header for 'User defined text information frame', ID: "TXXX" >
        // Text encoding    $xx
        // Description < text string according to encoding > $00(00)
        // Value < text string according to encoding >
        if (header.id === 'TXXX') {
            variableStart = 11;
            variableLength = getEndpointOfBytes(bytes, encoding, variableStart) - variableStart;
            const value = {
                description: readBytesToString(bytes.slice(variableStart), encoding, variableLength),
                value: '',
            } as ITXXXMap;
            variableStart += variableLength + 1;
            variableStart = skipPaddingZeros(bytes, variableStart);
            value.value = readBytesToString(bytes.slice(variableStart), encoding);
            result.value = value;
        } else {
            result.value = readBytesToString(bytes.slice(11), encoding);
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
    /**
     * Comments frame:
     * <Header for 'Comment', ID: "COMM">
     * Text encoding           $xx
     * Language                $xx xx xx
     * Short content descrip.  <text string according to encoding> $00 (00)
     * The actual text         <full text string according to encoding>
     *
     * Unsychronised lyrics/text transcription frame:
     * <Header for 'Unsynchronised lyrics/text transcription', ID: "USLT">
     * Text encoding       $xx
     * Language            $xx xx xx
     * Content descriptor  <text string according to encoding> $00 (00)
     * Lyrics/text         <full text string according to encoding>
     */
    else if (header.id === 'COMM' || header.id === 'USLT') {
        encoding = bytes[10];
        variableStart = 14;
        variableLength = 0;

        const language = readBytesToISO8859(bytes.slice(11), 3);
        variableLength = getEndpointOfBytes(bytes, encoding, variableStart) - variableStart;
        const description = readBytesToString(bytes.slice(variableStart), encoding, variableLength);
        variableStart = skipPaddingZeros(bytes, variableStart + variableLength + 1);

        result.value = {
            language,
            description,
            value: readBytesToString(bytes.slice(variableStart), encoding),
        };
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
        // MIME is always encoded as ISO-8859, So always pass 0 to encoding argument.
        variableLength = getEndpointOfBytes(bytes, 0, variableStart) - variableStart;
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
        // check $00 at start of the image binary data
        variableStart = skipPaddingZeros(bytes, variableStart + variableLength + 1);
        image.data = bytes.slice(variableStart);
        result.value = image;
    }
    /**
     * Involved people list frame:
     * <Header for 'Involved people list', ID: "IPLS">
     * Text encoding    $xx
     * People list strings    <text strings according to encoding>
     */
    else if (header.id === 'IPLS') {
        encoding = bytes[10];
        result.value = readBytesToString(bytes.slice(11), encoding);
    }
    /**
     * Ownership frame:
     * <Header for 'Ownership frame', ID: "OWNE">
     * Text encoding   $xx
     * Price payed     <text string> $00
     * Date of purch.  <text string>
     * Seller          <text string according to encoding>
     */
    else if (header.id === 'OWNE') {
        encoding = bytes[10];
        variableStart = 11;
        variableLength = getEndpointOfBytes(bytes, encoding, variableStart);
        const pricePayed = readBytesToISO8859(bytes.slice(variableStart), variableLength);
        variableStart += variableLength + 1;
        const dateOfPurch = readBytesToISO8859(bytes.slice(variableStart), 8);
        variableStart += 8;
        result.value = {
            pricePayed,
            dateOfPurch,
            seller: readBytesToString(bytes.slice(variableStart), encoding),
        };
    }
    else {
        // Do nothing to other frames.
    }
    return result;
}
