# id3-parser

A pure JavaScript id3 tag parser.

## Getting Started
### Installation 

```shell
npm install id3-parser --save
```

### Usage

```js
var ID3 = require('id3-parser');
var Reader = ID3.Reader;
// do parse as you like
ID3.parse(new Reader(url, type));
ID3.parseFromBuffer(buffer);
```

The `id3-parser` module is certainly a CommonJS package and used in node.js. But, you can use it in mordern browser via `browserify`, or just include `id3-parser.browser.js`.

## API

### new Reader(url, type)

Generate a reader for id3-parser to parse.

```js
var Reader = require('id3-parser').Reader;
var reader = new Reader(url, type);
```

The `type` could be:

1. `'fileurl'`(node) -- Default, if type is omitted. And url should be string.
2. `'ajaxurl'`(browser) -- url should be string.
3. `'file'`(browser File) -- url should be File instance.
4. `'buffer'`(Buffer or Array) -- url should be `Buffer` or `Uint8Array` instance.

And the `url` corresponds to its type(descriped above).

### parse(reader)

Parse id3v1 and id3v2.3 tags from a reader.

```js
var ID3 = require('id3-parser');
ID3.parse(reader); // return the parsed tag object
```

A typical parsed tag would be like:

```js
{
    version: {
        v2: {
            major: 2,
            minor: 3,
            revision: 0
        },
        v1: {
            major: 1,
            minor: 1
        }
    },
    flags: {
        unsync: 0,
        xheader: 0,
        experimental: 0
    },
    title: 'Bye Bye',
    artist: 'Mariah Carey',
    album: 'E=Mc²',
    'user-defined-text-information': 'Tagging time',
    year: '2008-04-14',
    image: {
        type: 'cover-front',
        mime: 'image/jpeg',
        imageType: null,
        description: 'e',
    },
    lyrics: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    comment: '',
    track: 0,
    genre: ''
}
```

### parseFromBuffer(buffer)

If you already have a buffer from audio file, this API will help you to parse.

Make sure the `buffer` could only be `Buffer` or `Uint8Array` instance.

### parseV1(reader)

Only parse id3v1 tag info.

### parseV1FromBuffer(buffer)

Parse id3v1 tag info from a buffer.

### parseV2(reader)

Only parse id3v2.3 tag info

### parseV2FromBuffer(buffer)

Parse id3v2.3 tag info from a buffer.


## Test

Run code below to see test info.

```shell
npm test
```

When first run test, script will try to download music file from remote. The download time depends on net.

## Release History

2015-07-24&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.2`&nbsp;&nbsp;&nbsp;&nbsp;fix bug: `calcFrameSize` returning `NaN`

2015-07-21&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.1`&nbsp;&nbsp;&nbsp;&nbsp;fix version info bug

2015-06-22&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.0`&nbsp;&nbsp;&nbsp;&nbsp;init(parse v1 and most v2.3 tag)

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.