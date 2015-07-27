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

Note: if you want to load remote music file in browser and to parse it, you can request the file and convert it into `Uint8Array`. There is one util (at `lib/fetch.js`, but not part of published `id3-parser` lib) in the project to help you.

```js
// if you integrate id3-parser.browser.js with the `lib/ajax.js`
// or you bundle up all the modules yourself,
// and then include the enhanced lib in browser,you can do as below:
ajax('http://7sbnba.com1.z0.glb.clouddn.com/test-v1-v2.3.mp3').then(function(res) {
    ID3.parse(new Uint8Array(res.target.response)).then(console.log.bind(console));
});
// output:
// {
//     album: "E=Mc²",
//     artist: "Mariah Carey",
//     comment: "",
//     genre: ""
//     // ...
// }
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
module.exports = {
    version: {
        v2: {
            major: 2,
            minor: 3,
            revision: 0,
            // flags moved to v2
            flags: {
                unsync: 0,
                xheader: 0,
                experimental: 0
            }
        },
        v1: {
            major: 1,
            minor: 1
        }
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
    lyrics: 'xxxxxxxxxxxxxxxxx',
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

2015-07-27&nbsp;&nbsp;&nbsp;&nbsp;`v1.0.1`&nbsp;&nbsp;&nbsp;&nbsp;bugfix: `StringUtils.readUTF8String` convert error with 3 bytes length character.

2015-07-27&nbsp;&nbsp;&nbsp;&nbsp;`v1.0.0`&nbsp;&nbsp;&nbsp;&nbsp;API change and some improvements.

2015-07-24&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.2`&nbsp;&nbsp;&nbsp;&nbsp;fix bug: `calcFrameSize` returning `NaN`

2015-07-21&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.1`&nbsp;&nbsp;&nbsp;&nbsp;fix version info bug

2015-06-22&nbsp;&nbsp;&nbsp;&nbsp;`v0.1.0`&nbsp;&nbsp;&nbsp;&nbsp;init(parse v1 and most v2.3 tag)

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.