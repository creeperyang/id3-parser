const toStr = String.fromCharCode;

/**
 * Convert utf8 bytes to string.
 * @description
 * According to utf8 spec, char is encoded to [1,4] byte.
 * 1. 1 byte, 0 - 0x7f, the same as Ascii chars.
 * 2. 2 bytes, 110xxxxx 10xxxxxx.
 * 3. 3 bytes, 1110xxxx 10xxxxxx 10xxxxxx.
 * 4. 4 bytes, 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx.
 * For 2-4 bytes, remove leading 10/110/1110/11110 and get final codepoint.
 * @param bytes Utf8 binary bytes, usually array of numbers.
 * @param maxToRead Max number of bytes to read.
 */
export function readBytesToUTF8(bytes: ArrayLike<number>, maxToRead?: number): string {
    if (maxToRead == null || maxToRead < 0) {
        maxToRead = bytes.length;
    } else {
        maxToRead = Math.min(maxToRead, bytes.length);
    }
    let index = 0;
    // Process BOM(Byte order mark).
    if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
        index = 3;
    }

    const arr = [];
    // Continue to insert string to arr until processed bytes' length reach max.
    for (let i = 0; index < maxToRead; i++) {
        const byte1 = bytes[index++];
        let byte2;
        let byte3;
        let byte4;
        let codepoint;
        // End flag.
        if (byte1 === 0x00) {
            break;
        }
        // ASCII
        else if (byte1 < 0x80) {
            arr[i] = toStr(byte1);
        }
        // Check 110yyyyy（C0-DF) 10zzzzzz(80-BF）--> 000080 - 0007FF
        // Because C0/C1 is invalid (RFC 3629), begin with C2.
        else if (byte1 >= 0xC2 && byte1 < 0xE0) {
            byte2 = bytes[index++];
            arr[i] = toStr(
                ((byte1 & 0x1F) << 6) + (byte2 & 0x3F),
            );
        }
        // Check 1110xxxx(E0-EF) 10yyyyyy 10zzzzzz --> 000800 - 00D7FF 00E000 - 00FFFF
        else if (byte1 >= 0xE0 && byte1 < 0xF0) {
            byte2 = bytes[index++];
            byte3 = bytes[index++];
            arr[i] = toStr(
                ((byte1 & 0x0F) << 12) + ((byte2 & 0x3F) << 6) + (byte3 & 0x3F),
            );
        }
        // Check 11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz
        // --> 010000 - 10FFFF
        // RFC 3629 makes F5, F6, F7 invalid.
        else if (byte1 >= 0xF0 && byte1 < 0xF5) {
            byte2 = bytes[index++];
            byte3 = bytes[index++];
            byte4 = bytes[index++];
            // See <https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae>
            codepoint = ((byte1 & 0x07) << 18) +
                ((byte2 & 0x3F) << 12) +
                ((byte3 & 0x3F) << 6) +
                (byte4 & 0x3F) - 0x10000;
            // Invoke String.fromCharCode(H, L) to get correct char.
            arr[i] = toStr(
                (codepoint >> 10) + 0xD800,
                (codepoint & 0x3FF) + 0xDC00,
            );
        }
    }
    return arr.join('');
}

/**
 * Convert utf16 bytes to string.
 * @description
 * Utf16 represents char with one or two 16-bit code units per code point.
 * 1. Range 0 - 0xFFFF (i.e. the BMP), can be represented with one 16-bit.
 * 2. Range 0x10000 - 0x10FFFF (i.e. outside the BMP), can only be encoded using two 16-bit code units.
 *
 * The two 16-bit is called a surrogate pair.
 * - The first code unit of a surrogate pair is always in the range from 0xD800 to 0xDBFF,
 *   and is called a high surrogate or a lead surrogate.
 * - The second code unit of a surrogate pair is always in the range from 0xDC00 to 0xDFFF,
 *   and is called a low surrogate or a trail surrogate.
 *
 * A codepoint `C` greater than 0xFFFF corresponds to a surrogate pair <H, L>:
 * H = Math.floor((C - 0x10000) / 0x400) + 0xD800
 * L = (C - 0x10000) % 0x400 + 0xDC00
 * C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
 * @param bytes Utf16 binary bytes, usually array of numbers.
 * @param isBigEndian Specify whether utf16 bytes big-endian or little-endian.
 * @param maxToRead Max number of bytes to read.
 */
export function readBytesToUTF16(bytes: ArrayLike<number>, isBigEndian?: boolean, maxToRead?: number): string {
    if (maxToRead == null || maxToRead < 0) {
        maxToRead = bytes.length;
    } else {
        maxToRead = Math.min(maxToRead, bytes.length);
    }
    let index = 0;
    let offset1 = 1;
    let offset2 = 0;
    // Check BOM and set isBigEndian.
    if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
        isBigEndian = true;
        index = 2;
    } else if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
        isBigEndian = false;
        index = 2;
    }
    if (isBigEndian) {
        offset1 = 0;
        offset2 = 1;
    }

    const arr: string[] = [];
    let byte1: number;
    let byte2: number;
    let word1: number;
    let word2: number;
    let byte3: number;
    let byte4: number;
    for (let i = 0; index < maxToRead; i++) {
        // Set high/low 8 bit corresponding to LE/BE.
        byte1 = bytes[index + offset1];
        byte2 = bytes[index + offset2];
        // Get first 16 bits' value.
        word1 = (byte1 << 8) + byte2;
        index += 2;
        // If 16 bits are all 0, means end.
        if (word1 === 0x0000) {
            break;
        }
        // First 16 bit: 0xD800 - 0xDFFF is reversed to indicate that
        // the current 32 bits are to represent one char in Supplementary Planes.
        // And if first 8 bits are not in [0xD8, 0xE0)，means that
        // the current 16 bits are represent one char in Basic Multilingual Plane.
        else if (byte1 < 0xD8 || byte1 >= 0xE0) {
            arr[i] = toStr(word1);
        }
        else {
            // Get next 16 bits.
            byte3 = bytes[index + offset1];
            byte4 = bytes[index + offset2];
            word2 = (byte3 << 8) + byte4;
            index += 2;
            // Then invoke String.fromCharCode(H, L) to get correct char.
            arr[i] = toStr(word1, word2);
        }
    }
    return arr.join('');
}

export function readBytesToISO8859(bytes: ArrayLike<number>, maxToRead?: number): string {
    if (maxToRead == null || maxToRead < 0) {
        maxToRead = bytes.length;
    } else {
        maxToRead = Math.min(maxToRead, bytes.length);
    }
    const arr: string[] = [];
    for (let i = 0; i < maxToRead; i++) {
        arr.push(toStr(bytes[i]));
    }
    return arr.join('');
}

/**
 * Convert bytes to string according to encoding.
 * @param bytes Binary bytes.
 * @param encoding id3v2 tag encoding, always 0/1/2/3.
 * @param maxToRead Max number of bytes to read.
 */
export function readBytesToString(bytes: ArrayLike<number>, encoding: number, maxToRead?: number): string | null {
    if (encoding === 0) {
        return readBytesToISO8859(bytes, maxToRead);
    } else if (encoding === 3) {
        return readBytesToUTF8(bytes, maxToRead);
    } else if (encoding === 1 || encoding === 2) {
        return readBytesToUTF16(bytes, undefined, maxToRead);
    } else {
        return null;
    }
}

export function getEndpointOfBytes(bytes: ArrayLike<number>, encoding: number, start: number = 0) {
    // ISO-8859 use $00 as end flag, and
    // unicode use $00 00 as end flag.
    const checker = encoding === 0
        ? (index: number) => bytes[index] === 0
        : (index: number) => (bytes[index] === 0 && bytes[index + 1] === 0);
    let i = start;
    for (; i < bytes.length; i++) {
        if (checker(i)) {
            break;
        }
    }
    return i;
}

export function skipPaddingZeros(bytes: ArrayLike<number>, start: number): number {
    for (let i = start; ; i++) {
        if (bytes[i] === 0) {
            start++;
        } else {
            break;
        }
    }
    return start;
}
