# id3-parser

[![Build Status](https://travis-ci.org/creeperyang/id3-parser.svg?branch=master)](https://travis-ci.org/creeperyang/id3-parser)

A pure JavaScript id3 tag parser.

## Getting Started

### Installation 

```shell
npm install id3-parser --save
```

### Usage

```js
var ID3 = require('id3-parser');
// do parse
ID3.parse(buffer|file|uint8Array).then(function(tag) {
    console.log(tag);
});
```

The `id3-parser` module is certainly a CommonJS package and used in node.js. But, you can use it in mordern browser via `browserify`, or just include `id3-parser.browser.js`.

Note: if you want to load remote music file in browser and to parse it, you can request the file and convert it into `Uint8Array`. There is one util in the project(but not part of `id3-parser`) to help you.

```js
// include lib/fetch.js (with browserify)
var ajax = require('lib/fetch.js');
ajax('http://7sbnba.com1.z0.glb.clouddn.com/test-v1-v2.3.mp3').then(function(res) { 
    return new Uint8Array(res.target.response);
}).then(function(uint8Array) {
    console.log(uint8Array); //[73, 68, 51, 3......]
    ID3.parse(uint8Array);
}); 
```

## API

### parse(buffer|uint8Array|file)

Parse id3v1 and id3v2.3 tags from a buffer(Node `Buffer` instance), uint8Array(`Uint8Array` instance), or file(browser `File` instance). And the return value is a promise.

```js
var ID3 = require('id3-parser');
ID3.parse(buffer|uint8Array|file).then(function(tag) {
    console.log(tag); // the parsed tag info
}); 
```

The typical parsed tag would be like:

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

So the api is high-level and can automatically detect node or browser enviroment.

## Test

Run code below to see test info.

```shell
npm test
```

When first run test, script will try to download music file from remote. The download time depends on net.

## Release History

2015-07-27&nbsp;&nbsp;&nbsp;&nbsp;`v1.0.0`&nbsp;&nbsp;&nbsp;&nbsp;API change and some improvements.

2015-07-24&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.2`&nbsp;&nbsp;&nbsp;&nbsp;fix bug: `calcFrameSize` returning `NaN`

2015-07-21&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.1`&nbsp;&nbsp;&nbsp;&nbsp;fix version info bug

2015-06-22&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.0`&nbsp;&nbsp;&nbsp;&nbsp;init(parse v1 and most v2.3 tag)

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.