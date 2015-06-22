# id3-parser

A pure JavaScript id3 tag parser.

## Getting Started
### Installation 

```shell
npm install id3-parser
```

### Usage

```js
var ID3 = require('id3-parser');
var Reader = ID3.Reader;
// do parse as you like
ID3.parse(new Reader(url, type));
ID3.parseFromBuffer(buffer);
```

The `id3-parser` module is certainly a CommonJS package and used in node.js. But, you can use it in mordern browser via `browserify`.

## API

### new Reader(url, type)

```js
var Reader = require('id3-parser').Reader;
var reader = new Reader(url, type);
```

The `type` could be:

1. fileurl(node) -- default, if type is omitted
2. ajaxurl(browser) 
3. file(browser File) 
4. buffer(Buffer or Uint8Array)

And the `url` corresponds to its type.

### parse(reader)

```js
var ID3 = require('id3-parser');
ID3.parse(reader); // return the parsed tag object
```

A typical parsed tag would be like:

```js
{
    version: {
        major: 2,
        minor: 3,
        revision: 0
    },
    flags: {
        unsync: 0,
        xheader: 0,
        experimental: 0
    },
    artist: '王菲',
    album: '匆匆那年',
    title: '匆匆那年',
    year: '2014-11-05',
    comments: 'V1.0',
    lyrics: '',
    image: {
        type: 'cover-front',
        mime: 'image/jpeg',
        imageType: null,
        description: 'e',
        data: Buffer<xxx>
    }
}
```

### parseFromBuffer(buffer)

If you already have a buffer from audio file, this API will help you to parse.

Make sure the `buffer` could only be `Buffer` or `Uint8Array` instance.

### parseV1(reader)

Only parse id3v2.1 tag info.

### parseV1FromBuffer(buffer)

Parse id3v2.1 tag info from a buffer.

### parseV2(reader)

Only parse id3v2.3 tag info

### parseV2FromBuffer(buffer)

Parse id3v2.3 tag info from a buffer.


## Test

Currently only a simple test is added. Run code below to see test info.

```shell
npm test
```

## Release History

2015-06-22&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.0`&nbsp;&nbsp;&nbsp;&nbsp;init(parse v2.1 and most v2.3 tag)

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.