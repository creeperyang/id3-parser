(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
    /*
     * Textual frames
     */
    'TALB': 'album',
    'TBPM': 'bpm',
    'TCOM': 'composer',
    'TCON': 'genre',
    'TCOP': 'copyright',
    'TDEN': 'encoding-time',
    'TDLY': 'playlist-delay',
    'TDOR': 'original-release-time',
    'TDRC': 'recording-time',
    'TDRL': 'release-time',
    'TDTG': 'tagging-time',
    'TENC': 'encoder',
    'TEXT': 'writer',
    'TFLT': 'file-type',
    'TIPL': 'involved-people',
    'TIT1': 'content-group',
    'TIT2': 'title',
    'TIT3': 'subtitle',
    'TKEY': 'initial-key',
    'TLAN': 'language',
    'TLEN': 'length',
    'TMCL': 'credits',
    'TMED': 'media-type',
    'TMOO': 'mood',
    'TOAL': 'original-album',
    'TOFN': 'original-filename',
    'TOLY': 'original-writer',
    'TOPE': 'original-artist',
    'TOWN': 'owner',
    'TPE1': 'artist',
    'TPE2': 'band',
    'TPE3': 'conductor',
    'TPE4': 'remixer',
    'TPOS': 'set-part',
    'TPRO': 'produced-notice',
    'TPUB': 'publisher',
    'TRCK': 'track',
    'TRSN': 'radio-name',
    'TRSO': 'radio-owner',
    'TSOA': 'album-sort',
    'TSOP': 'performer-sort',
    'TSOT': 'title-sort',
    'TSRC': 'isrc',
    'TSSE': 'encoder-settings',
    'TSST': 'set-subtitle',
    'TXXX': 'user-defined-text-information',
    'TYER': 'year',
    /*
     * URL frames
     */
    'WCOM': 'url-commercial',
    'WCOP': 'url-legal',
    'WOAF': 'url-file',
    'WOAR': 'url-artist',
    'WOAS': 'url-source',
    'WORS': 'url-radio',
    'WPAY': 'url-payment',
    'WPUB': 'url-publisher',
    /*
     * URL frames (<=2.2)
     */
    'WAF': 'url-file',
    'WAR': 'url-artist',
    'WAS': 'url-source',
    'WCM': 'url-commercial',
    'WCP': 'url-copyright',
    'WPB': 'url-publisher',
    /*
     * Comment frame
     */
    'COMM': 'comments',
    'USLT': 'lyrics',
    /*
     * Image frame
     */
    'APIC': 'image',
    'PIC': 'image'
};
},{}],2:[function(require,module,exports){
'use strict';

var Genres = [
    'Blues',
    'Classic Rock',
    'Country',
    'Dance',
    'Disco',
    'Funk',
    'Grunge',
    'Hip-Hop',
    'Jazz',
    'Metal',
    'New Age',
    'Oldies',
    'Other',
    'Pop',
    'R&B',
    'Rap',
    'Reggae',
    'Rock',
    'Techno',
    'Industrial',
    'Alternative',
    'Ska',
    'Death Metal',
    'Pranks',
    'Soundtrack',
    'Euro-Techno',
    'Ambient',
    'Trip-Hop',
    'Vocal',
    'Jazz+Funk',
    'Fusion',
    'Trance',
    'Classical',
    'Instrumental',
    'Acid',
    'House',
    'Game',
    'Sound Clip',
    'Gospel',
    'Noise',
    'AlternRock',
    'Bass',
    'Soul',
    'Punk',
    'Space',
    'Meditative',
    'Instrumental Pop',
    'Instrumental Rock',
    'Ethnic',
    'Gothic',
    'Darkwave',
    'Techno-Industrial',
    'Electronic',
    'Pop-Folk',
    'Eurodance',
    'Dream',
    'Southern Rock',
    'Comedy',
    'Cult',
    'Gangsta Rap',
    'Top 40',
    'Christian Rap',
    'Pop / Funk',
    'Jungle',
    'Native American',
    'Cabaret',
    'New Wave',
    'Psychedelic',
    'Rave',
    'Showtunes',
    'Trailer',
    'Lo-Fi',
    'Tribal',
    'Acid Punk',
    'Acid Jazz',
    'Polka',
    'Retro',
    'Musical',
    'Rock & Roll',
    'Hard Rock',
    'Folk',
    'Folk-Rock',
    'National Folk',
    'Swing',
    'Fast  Fusion',
    'Bebob',
    'Latin',
    'Revival',
    'Celtic',
    'Bluegrass',
    'Avantgarde',
    'Gothic Rock',
    'Progressive Rock',
    'Psychedelic Rock',
    'Symphonic Rock',
    'Slow Rock',
    'Big Band',
    'Chorus',
    'Easy Listening',
    'Acoustic',
    'Humour',
    'Speech',
    'Chanson',
    'Opera',
    'Chamber Music',
    'Sonata',
    'Symphony',
    'Booty Bass',
    'Primus',
    'Porn Groove',
    'Satire',
    'Slow Jam',
    'Club',
    'Tango',
    'Samba',
    'Folklore',
    'Ballad',
    'Power Ballad',
    'Rhythmic Soul',
    'Freestyle',
    'Duet',
    'Punk Rock',
    'Drum Solo',
    'A Cappella',
    'Euro-House',
    'Dance Hall',
    'Goa',
    'Drum & Bass',
    'Club-House',
    'Hardcore',
    'Terror',
    'Indie',
    'BritPop',
    'Negerpunk',
    'Polsk Punk',
    'Beat',
    'Christian Gangsta Rap',
    'Heavy Metal',
    'Black Metal',
    'Crossover',
    'Contemporary Christian',
    'Christian Rock',
    'Merengue',
    'Salsa',
    'Thrash Metal',
    'Anime',
    'JPop',
    'Synthpop',
    'Rock/Pop'
];

module.exports = Genres;

},{}],3:[function(require,module,exports){
'use strict';

module.exports = [
    'other',
    'file-icon',
    'icon',
    'cover-front',
    'cover-back',
    'leaflet',
    'media',
    'artist-lead',
    'artist',
    'conductor',
    'band',
    'composer',
    'writer',
    'location',
    'during-recording',
    'during-performance',
    'screen',
    'fish',
    'illustration',
    'logo-band',
    'logo-publisher'
];
},{}],4:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./frameTypes.js":1,"./genres.js":2,"./imageTypes.js":3,"./stringUtils.js":5,"promise-a-plus":6}],5:[function(require,module,exports){
/**
 * Copyright (c) 2010, António Afonso <antonio.afonso gmail.com>. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY António Afonso ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
'use strict';

// A little change: make return value is primitive string, === equla and so on.
var StringUtils = {
    readUTF16String: function(bytes, bigEndian, maxBytes) {
        var ix = 0;
        var offset1 = 1, offset2 = 0;
        maxBytes = Math.min(maxBytes||bytes.length, bytes.length);

        if( bytes[0] === 0xFE && bytes[1] === 0xFF ) {
            bigEndian = true;
            ix = 2;
        } else if( bytes[0] === 0xFF && bytes[1] === 0xFE ) {
            bigEndian = false;
            ix = 2;
        }
        if( bigEndian ) {
            offset1 = 0;
            offset2 = 1;
        }

        var arr = [], byte1, byte2, byte3, byte4, word1, word2, j;
        for( j = 0; ix < maxBytes; j++ ) {
            byte1 = bytes[ix+offset1];
            byte2 = bytes[ix+offset2];
            word1 = (byte1<<8)+byte2;
            ix += 2;
            if( word1 === 0x0000 ) {
                break;
            } else if( byte1 < 0xD8 || byte1 >= 0xE0 ) {
                arr[j] = String.fromCharCode(word1);
            } else {
                byte3 = bytes[ix+offset1];
                byte4 = bytes[ix+offset2];
                word2 = (byte3<<8)+byte4;
                ix += 2;
                arr[j] = String.fromCharCode(word1, word2);
            }
        }
        return arr.join('');
    },
    readUTF8String: function(bytes, maxBytes) {
        var ix = 0;
        maxBytes = Math.min(maxBytes||bytes.length, bytes.length);

        if( bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF ) {
            ix = 3;
        }

        var arr = [];
        for( var j = 0; ix < maxBytes; j++ ) {
            var byte1 = bytes[ix++], byte2, byte3, byte4, codepoint;
            if( byte1 === 0x00 ) {
                break;
            } else if( byte1 < 0x80 ) {
                arr[j] = String.fromCharCode(byte1);
            } else if( byte1 >= 0xC2 && byte1 < 0xE0 ) {
                byte2 = bytes[ix++];
                arr[j] = String.fromCharCode(((byte1&0x1F)<<6) + (byte2&0x3F));
            } else if( byte1 >= 0xE0 && byte1 < 0xF0 ) {
                byte2 = bytes[ix++];
                byte3 = bytes[ix++];
                arr[j] = String.fromCharCode(((byte1&0xFF)<<12) + ((byte2&0x3F)<<6) + (byte3&0x3F));
            } else if( byte1 >= 0xF0 && byte1 < 0xF5) {
                byte2 = bytes[ix++];
                byte3 = bytes[ix++];
                byte4 = bytes[ix++];
                codepoint = ((byte1&0x07)<<18) + ((byte2&0x3F)<<12)+ ((byte3&0x3F)<<6) + (byte4&0x3F) - 0x10000;
                arr[j] = String.fromCharCode(
                    (codepoint>>10) + 0xD800,
                    (codepoint&0x3FF) + 0xDC00
                );
            }
        }
        return arr.join('');
    },
    readNullTerminatedString: function(bytes, maxBytes) {
        var arr = [], i, byte1;
        maxBytes = maxBytes || bytes.length;
        for ( i = 0; i < maxBytes; ) {
            byte1 = bytes[i++];
            if( byte1 === 0x00 ) {
                break;
            }
            arr[i-1] = String.fromCharCode(byte1);
        }
        return arr.join('');
    }
};

module.exports = StringUtils;
},{}],6:[function(require,module,exports){
'use strict';

var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(executor) {
    var state = PENDING;

    // store value once FULFILLED or REJECTED
    var value = null;

    // store sucess & failure handlers
    var handlers = [];

    function fulfill(result) {
        state = FULFILLED;
        value = result;
        handlers.forEach(handle);
        handlers = null;
    }

    function reject(error) {
        state = REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers = null;
    }

    function resolve(result) {
        try {
            var then = getThen(result);
            if (then) {
                doResolve(function() {
                    then.apply(result, arguments);
                }, resolve, reject);
                return;
            }
            fulfill(result);
        } catch (e) {
            reject(e);
        }
    }

    function handle(handler) {
        if (state === PENDING) {
            handlers.push(handler);
        } else {
            if (state === FULFILLED &&
                typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(value);
            }
            if (state === REJECTED &&
                typeof handler.onRejected === 'function') {
                handler.onRejected(value);
            }
        }
    }

    this.done = function(onFulfilled, onRejected) {
        // ensure we are always asynchronous
        setTimeout(function() {
            handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            });
        }, 0);
    };

    var then = function(onFulfilled, onRejected) {
        var self = this;
        var res;
        var npromise = new Promise(function(resolve, reject) {
            return self.done(function(result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        res = onFulfilled(result);
                        if (res === npromise) {
                            return reject(new TypeError('The `promise` and `x` refer to the same object.'));
                        }
                        return resolve(res);
                    } catch (e) {
                        return reject(e);
                    }
                } else {
                    return resolve(result);
                }
            }, function(error) {
                if (typeof onRejected === 'function') {
                    try {
                        res = onRejected(error);
                        if (res === npromise) {
                            return reject(new TypeError('The `promise` and `x` refer to the same object.'));
                        }
                        return resolve(res);
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return reject(error);
                }
            });
        });
        return npromise;
    };

    this.then = then;

    this.catch = function(onRejected) {
        return then.call(this, undefined, onRejected);
    };

    doResolve(executor, resolve, reject);
}

/**
 * Check if a value is a Promise and, if it is,
 * return the `then` method of that promise.
 *
 * @param {Promise|Any} value
 * @return {Function|Null}
 */
function getThen(value) {
    var type = typeof value;
    var then;
    if (value && (type === 'object' || type === 'function')) {
        then = value.then;
        if (typeof then === 'function') {
            return then;
        }
    }
    return null;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * ensure asynchronous execution of onFulfilled/onRejected
 *
 * @param {Function} fn A resolver function that may not be trusted
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
function doResolve(fn, onFulfilled, onRejected) {
    var done = false;
    try {
        fn(function(value) {
            if (done) {
                return;
            }
            done = true;
            setTimeout(function() {
                onFulfilled(value);
            }, 0);
        }, function(reason) {
            if (done) {
                return;
            }
            done = true;
            setTimeout(function() {
                onRejected(reason);
            }, 0);
        });
    } catch (e) {
        if (done) {
            return;
        }
        done = true;
        setTimeout(function() {
            onRejected(e);
        }, 0);
    }
}

Promise.resolve = function(value) {
    return new Promise(function(resolve, reject) {
        resolve(value);
    });
};

Promise.reject = function(reason) {
    return new Promise(function(resolve, reject) {
        reject(reason);
    });
};

Promise.all = function(all) {
    var results = [];
    var len, promise, i;
    var resolved = 0;
    if(!all || !(len = all.length)) {
        throw new Error('ArgumentsError: currently only array is allowed');
    }
    return new Promise(function(resolve, reject) {
        for(i = 0; i < len; i++) {
            (function(i) {
                promise = all[i];
                if(!(promise instanceof Promise)) {
                    promise = Promise.resolve(promise);
                }
                promise.catch(function(reason) {
                    reject(reason);
                });
                promise.then(function(value) {
                    results[i] = value;
                    if(++resolved === len) {
                        resolve(results);
                    }
                });
            })(i);
        }
    });
};

// Returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, 
// with the value or reason from that promise.
Promise.race = function(array) {
    var deferred;
    if(!array || !array.length) {
        throw new Error('ArgumentsError: currently only array is allowed');
    }
    deferred = Promise.deferred();
    array.forEach(function(promise) {
        if(promise instanceof Promise) {
            promise.then(function(value) {
                deferred.resolve(value);
            }, function(reason) {
                deferred.reject(reason);
            });
        } else {
            // if not promise, immediately resolve result promise
            deferred.resolve(promise);
        }
    });
    return deferred.promise;
};

/**
 * A useful api for Promise,
 * return the `deferred` object binding to a promise. 
 * And you can control the promise via `deferred.resolve`/`deferred.reject`.
 *
 * @param {Promise|Any} value
 * @return {Function|Null}
 */
Promise.deferred = function() {
    var deferred = {};
    deferred.promise = new Promise(function(resolve,reject){
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
};

// Official API (especially chrome) is Promise.defer
// so just add Promise.defer and let it refer to Promise.deferred
Promise.defer = Promise.deferred;

module.exports = Promise;

},{}]},{},[4]);
