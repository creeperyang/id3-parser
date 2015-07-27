'use strict';

/**
 * id3 tag parser
 *
 * @author: creeperyang
 * @date: Tue Jun 16 2015 16:28:35 GMT+0800
 */

var Promise = Promise || require('promise-a-plus');
var Genres = require('./genres.js');
var frameTypes = require('./frameTypes.js');
var imageTypes = require('./imageTypes.js');
var StringUtils = require('./stringUtils.js');
var readUTF16String = StringUtils.readUTF16String;
var readUTF8String = StringUtils.readUTF8String;

var V1_MIN_LENGTH = 128;
var V2_MIN_LENGTH = 20; // TAG HEADER(10) + ONE FRAME HEADER(10)

var noop = function() {};
var isNodeJS = typeof window === 'undefined';
var g = isNodeJS ? global : window;

// Within v8 engine, Uint8Array may not have slice method, use subarray instead
if(!('slice' in Uint8Array.prototype)) {
    Uint8Array.prototype.slice = Uint8Array.prototype.subarray;
}

/**
 * parse id3 tag from buffer or file
 *
 * @param {Buffer|Uint8Array|File} buffer - Buffer to parse.
 * @return {Promise}
*/
function parse(buffer) {
    var deferred = Promise.defer();
    var File, FileReader, Buffer, reader;

    if(isNodeJS) {
        File = noop;
        FileReader = noop;
        Buffer = g.Buffer;
    } else {
        File = g.File;
        FileReader = g.FileReader;
        Buffer = noop;
    }
    if(buffer instanceof File) {
        reader = new FileReader();
        reader.onload = function(e) {
            buffer = new Uint8Array(e.target.result);
            deferred.resolve(buffer);
        };
        reader.readAsArrayBuffer(buffer);
    } else if(buffer instanceof Buffer || buffer instanceof Uint8Array){
        deferred.resolve(buffer);
    } else {
        throw new Error('buffer should be instance of Buffer|Uint8Array|File.');
    }
    return deferred.promise.then(function(buffer) {
        var v1 = parseV1FromBuffer(buffer);
        var v2 = parseV2FromBuffer(buffer);
        var p;
        if(!v2) {
            return v1;
        }
        for(p in v1) {
            if(!(p in v2) || (v2[p] === '')) {
                v2[p] = v1[p];
            }
        }
        // adjust version info
        v2.version = {
            v2: v2.version
        };
        if(v1) {
            v2.version.v1 = v1.version;
        }
        return v2;
    });
}

function parseV1FromBuffer(buffer) {
    if(!buffer || buffer.length < V1_MIN_LENGTH) {
        return false;
    }

    buffer = buffer.slice(buffer.length - V1_MIN_LENGTH);

    var tags = {
        version: {
            major: 1,
            minor: 0
        }
    };
    var flag = readUTF8String(buffer, 3);
    var whiteRe = /(^[\s\u0000]+|[\s\u0000]+$)/;
    if(flag !== 'TAG') {
        return false;
    }

    // .replace(/(^\s+|\s+$)/, '')
    tags.title = readUTF8String(buffer.slice(3), 30).replace(whiteRe, '');
    tags.artist = readUTF8String(buffer.slice(33), 30).replace(whiteRe, '');
    tags.album = readUTF8String(buffer.slice(63), 30).replace(whiteRe, '');
    tags.year = readUTF8String(buffer.slice(93), 4).replace(whiteRe, '');

    
    // If there is a zero byte at [125], the comment is 28 bytes and the remaining 2 are [0, trackno]
    if(buffer[125] === 0) {
        tags.comment = readUTF8String(buffer.slice(97), 28).replace(whiteRe, '');
        tags.version.minor = 1;
        tags.track = buffer[126];
    } else {
        tags.comment = readUTF8String(buffer.slice(97), 30).replace(whiteRe, '');
    }
    tags.genre = Genres[buffer[127]] || '';

    return tags;
}

function parseV2FromBuffer(buffer) {
    if(!buffer || buffer.length < V2_MIN_LENGTH) {
        return false;
    }
    var tags = parseV2Header(buffer.slice(0, 14));
    var flags, headerSize, tagSize;
    if(!tags) {
        return false;
    }
    flags = tags.version.flags;
    headerSize = 10;

    // Currently do not support unsynchronisation
    if(flags.unsync) {
        throw new Error('not support unsynchronisation');
    }
    
    // Increment the header size to offset by if an extended header exists
    if(flags.xheader) {
        // usually extended header size is 6 or 10 bytes
        headerSize += calcTagSize(buffer.slice(10, 14));
    }

    tagSize = calcTagSize(buffer.slice(6, 10));
    parseV2Frames(buffer.slice(headerSize, tagSize + headerSize), tags);
    return tags;
}

/**
 * Parse single v2 frame
 *
 * @param {Buffer|Uint8Array} buffer - buffer to parse
 * @param {Number} minor - specify minor version of id3v2, future usage to parse v2.2/v2.4
 */
function parseFrame(buffer, minor, size) {
    var result = {tag: null, value: null};
    var header = {
        id: readUint8String(buffer, 4, 0),
        type: readUint8String(buffer, 1, 0),
        size: size || calcFrameSize(buffer.slice(4)),
        flags: [
            buffer[8],
            buffer[9]
        ]
    };
    var i, encoding, variableStart, variableLength;

    if(minor === 4) {
        // TODO: parse v2.4 frame
    }

    // No support for compressed, unsychronised, etc frames 
    if(header.flags[1] !== 0) {
        return false;
    }
    if(!(header.id in frameTypes)) {
        return false;
    }
    result.tag = frameTypes[header.id];

    if(header.type === 'T') {
        encoding = buffer[10];
        
        // TODO: Implement UTF-8, UTF-16 and UTF-16 with BOM properly?
        if(encoding === 0 || encoding === 3) {
            result.value = readUTF8String(buffer.slice(11)); 
        } else if(encoding === 1 || encoding === 2) {
            result.value = readUTF16String(buffer.slice(11));
        } else {
            return false;
        }
        if(header.id === 'TCON' && !!parseInt(result.value)) {
            result.value = Genres[parseInt(result.value)];
        }
    } else if(header.type === 'W') {
        result.value = readUTF8String(buffer.slice(10)); 
    } else if(header.id === 'COMM' || header.id === 'USLT') {
        
        // TODO: Implement UTF-16 without BOM properly?
        encoding = buffer[10];
        variableStart = 14;
        variableLength = 0;
        
        // Skip the comment description and retrieve only the comment its self
        for(i = variableStart;; i++) {
            if(encoding === 1 || encoding === 2) {
                if(buffer[i] === 0 && buffer[i+1] === 0) {
                    variableStart = i + 2;
                    break;
                }
                i++;
            } else {
                if(buffer[i] === 0) {
                    variableStart = i + 1;
                    break;
                }
            }
        }
        if(encoding === 0 || encoding === 3) {
            result.value = readUTF8String(buffer.slice(variableStart)); 
        } else if(encoding === 1 || encoding === 2) {
            result.value = readUTF16String(buffer.slice(variableStart)); 
        } else {
            return false;
        }
    } else if(header.id === 'APIC') {
        encoding = buffer[10];
        var image = {
                type: null,
                mime: null,
                imageType: null, // cover(front)/cover(back)/ ....
                description: null,
                data: null
            };
        variableStart = 11;
        variableLength = 0;
        for(i = variableStart;;i++) {
            if(buffer[i] === 0) {
                variableLength = i - variableStart;
                break;
            }
        }
        image.mime = readUTF8String(buffer.slice(variableStart), variableLength); 
        image.type = imageTypes[buffer[variableStart + variableLength + 1]] || 'other';
        variableStart += variableLength + 2;
        variableLength = 0;
        for(i = variableStart;; i++) {
            if(buffer[i] === 0) {
                variableLength = i - variableStart;
                break;
            }
        }
        image.description = variableLength === 0 ? null : readUTF16String(buffer.slice(variableStart), variableLength); 
        variableStart += variableLength + 1;
        // check $00 at start of the image binary data
        for(i = variableStart;; i++) {
            if(buffer[i] === 0) {
                variableStart++;
            } else {
                break;
            }
        }
        image.data = buffer.slice(variableStart);//variableStart + 1
        result.value = image;
    }
    return (result.tag ? result : false);
}

/**
 * Parse id3v2 header
 * 
 * @param {Buffer|Uint8Array} buffer - the header buffer(>= 10 bytes) 
 * @param {Object} tags - optional, the object for header info to write into
 *
 * @return {Object} parsed info
 */
function parseV2Header(buffer, tags) {
    if(!buffer || buffer.length < 10) {
        return false;
    }
    tags = tags || {};
    var identity = readUTF8String(buffer, 3);
    var version, flags, flagUint;
    if(identity !== 'ID3') {
        return false;
    }
    version = tags.version || (tags.version = {major: 2});
    flags = tags.version.flags || (tags.version.flags = {});

    version.minor = buffer[3];
    version.revision = buffer[4];
    flagUint = buffer[5];
    // 是否使用Unsynchronisation
    flags.unsync = flagUint & 0x80 !== 0;
    // 是否有扩展头部
    flags.xheader = flagUint & 0x40 !== 0;
    // 是否为测试标签
    flags.experimental = flagUint & 0x20 !== 0;

    return tags;
}

/*
 * parse all frames of a id3v2 tag
 */
function parseV2Frames(buffer, tags) {
    var position = 0;
    var version = tags.version;

    while(position < buffer.length) {
        var frame, slice;
        var size = calcFrameSize(buffer.slice(position + 4));
        // the left data would be '\u0000\u0000...', just a padding
        if(size === 0) {
            break;
        }
        // * < v2.3, frame ID is 3 chars, size is 3 bytes making a total size of 6 bytes
        // * >= v2.3, frame ID is 4 chars, size is 4 bytes, flags are 2 bytes, total 10 bytes
        slice = buffer.slice(position, position + 10 + size);
        if(!slice.length) {
            break;
        }
        frame = parseFrame(slice, version.minor, size);
        if(frame) {
            tags[frame.tag] = frame.value;
        }
        position += slice.length;
    }
}

/**
 * calc total id3v2 tag size(include header and all frames)
 *
 * @param {Uint8Array} buffer - 0xxxxxxx 0xxxxxxx 0xxxxxxx 0xxxxxxx
 */
function calcTagSize(buffer) {
    return (buffer[0] & 0x7f) * 0x200000 +
        (buffer[1] & 0x7f) * 0x4000 +
        (buffer[2] & 0x7f) * 0x80 +
        (buffer[3] & 0x7f);
}

/**
 * calc every id3v2 frame size(include header(10 bytes) and content size)
 *
 * @param {Uint8Array} buffer - xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx
 */
function calcFrameSize(buffer) {
    return buffer.length < 4 ? 0 : buffer[0] * 0x1000000 +
        buffer[1] * 0x10000 +
        buffer[2] * 0x100 +
        buffer[3];
}

/**
 * read string from buffer as uint8
 *
 * @param {Buffer/Uint8Array} buffer - read uint8 from buffer
 * @param {number} length - read length
 * @param {number} offset - read start index
 */
function readUint8String(buffer, length, offset, raw) {
    offset = offset || 0;
    if(length < 0) {
        length += buffer.length;
    }
    var Buffer = g.Buffer;
    var str = '';
    if(isNodeJS) {
        buffer = buffer.slice(offset, offset+length);
        return (buffer instanceof Buffer) ? 
            buffer.toString() : 
            (new Buffer(buffer)).toString();
    } else {
        for(var i = offset; i < (offset + length); i++) {
            str += String.fromCharCode(buffer[i]);
        }
        if(raw) {
            return str;
        }
        return decodeURIComponent(escape(str));
    }
}

// expose parse to global object if in browser
if(!isNodeJS) {
    g.ID3 = {
        parse: parse
    };
}

module.exports = {
    parse: parse
};
