# id3-parser

[![Build Status](https://travis-ci.org/creeperyang/id3-parser.svg?branch=master)](https://travis-ci.org/creeperyang/id3-parser)
[![npm version](https://badge.fury.io/js/id3-parser.svg)](https://badge.fury.io/js/id3-parser)

A pure JavaScript id3 tag parser.

## Getting Started

### Installation

```bash
npm install id3-parser --save
```

### Usage

```js
const ID3 = require('id3-parser');

// buffer is like fs.readFileSync('x.mp3')
ID3.parse(buffer|file|uint8Array).then(tag => {
    console.log(tag);
});
```

If you are in an environment with native or polyfilled Promise support, you can use `id3-parser/lib/parser-non-polyfilled.js` file:
```
const ID3 = require('id3-parser/lib/parser-non-polyfilled.js');
```

**[How to use inside browser?](https://github.com/creeperyang/id3-parser/wiki)**

## API

### parse(buffer|uint8Array|file)

Parse id3v1 and id3v2.3 tags from a buffer(Node `Buffer` instance), uint8Array(`Uint8Array` instance), or file(browser `File` instance).
And the return value is a promise.

```js
const ID3 = require('id3-parser');
ID3.parse(buffer|uint8Array|file).then(tag => {
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

## Typings

A typing definition file for use with id3-parser when programming in Typescript is available [here](https://github.com/dvdcxn/typed-id3-parser). Alternatively, it may be installed using [Typings](https://github.com/typings/typings). To do so, execute the following command within a folder/project with a `typings.json` file:

```bash
typings install id3-parser --save
```

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.