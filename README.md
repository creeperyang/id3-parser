# id3-parser

[![Build Status](https://travis-ci.org/creeperyang/id3-parser.svg?branch=master)](https://travis-ci.org/creeperyang/id3-parser)
[![npm version](https://badge.fury.io/js/id3-parser.svg)](https://badge.fury.io/js/id3-parser)
[![download times](https://img.shields.io/npm/dm/id3-parser.svg)](https://www.npmjs.com/package/id3-parser)

A pure JavaScript id3 tag parser.

## Installation & Usage

[![NPM](https://nodei.co/npm/id3-parser.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/id3-parser/)

```js
import * as ID3 from 'id3-parser';

const tag = ID3.parse(buffer|uint8Array|number[]);
console.log(tag);
```

If you want to use inside browser, you can use built-in browser helpers ( **always use with build tools such as webpack/browserify** ):

```js
import { parse } from 'id3-parser';
import { convertFileToBuffer, fetchFileAsBuffer } from 'id3-parser/lib/universal/helpers';
import universalParse from 'id3-parser/lib/universal';

// You have a File instance in browser
convertFileToBuffer(file).then(parse).then(tag => {
    console.log(tag);
});
// Or a remote mp3 file url
fetchFileAsBuffer(url).then(parse).then(tag => {
    console.log(tag);
});

// Or a smarter parse
universalParse(file|url|bytes).then(tag => {
    console.log(tag);
});
```

## API

In most cases, you always want input an array of number (binary data) and then get the id3 tag info.

```js
import { parse, parseV1Tag, parseV2Tag } from 'id3-parser';
parse(array) // ==> tag
```

### parse(buffer|uint8Array|number[])

Parse id3v1 and id3v2.3 tags from a buffer(Node `Buffer` instance), uint8Array(`Uint8Array` instance).

The typical parsed tag (return value) would be like:

```js
{
    version: {
        v1: false, // means no id3v1 tag
        v2: {
            major: 2,
            minor: 3,
            revision: 0,
            flags: {
                unsync: false,
                xheader: false,
                experimental: false,
            },
        },
    },
    artist: '王菲',
    album: '匆匆那年',
    title: '匆匆那年',
    year: '2014-11-05',
    comments: [{
        description: '',
        language: 'eng',
        value: 'V1.0',
    }],
    lyrics: [{
        description: 'h',
        language: 'eng',
        // tslint:disable-next-line:max-line-length
        value: '\n[00:01.92]匆匆那年（电影《匆匆那年》主题曲）\n[00:02.19]作词：林夕\n[00:02.63]作曲：梁翘柏\n[00:02.98]演唱：王菲\n[00:04.44]\n[00:28.71]匆匆那年我们  究竟说了几遍  再见之后再拖延\n[00:34.21]可惜谁有没有  爱过不是一场  七情上面的雄辩\n[00:39.90]匆匆那年我们  一时匆忙撂下  难以承受的诺言\n[00:45.45]只有等别人兑现\n[00:49.53]\n[00:51.17]不怪那吻痕还  没积累成茧\n[00:56.71]拥抱着冬眠也没能  羽化再成仙\n[01:02.33]不怪这一段情  没空反复再排练\n[01:07.88]是岁月宽容恩赐  反悔的时间\n[01:16.20]\n[01:18.92]如果再见不能红着眼  是否还能红着脸\n[01:24.71]就像那年匆促  刻下永远一起  那样美丽的谣言\n[01:29.97]如果过去还值得眷恋  别太快冰释前嫌\n[01:36.03]谁甘心就这样  彼此无挂也无牵\n[01:41.67]我们要互相亏欠  要不然凭何怀缅\n[01:57.64]\n[01:58.81]匆匆那年我们  见过太少世面  只爱看同一张脸\n[02:04.19]那么莫名其妙  那么讨人欢喜  闹起来又太讨厌\n[02:09.85]相爱那年活该  匆匆因为我们  不懂顽固的诺言\n[02:15.34]只是分手的前言\n[02:19.61]\n[02:20.99]不怪那天太冷  泪滴水成冰\n[02:26.63]春风也一样没  吹进凝固的照片\n[02:32.26]不怪每一个人  没能完整爱一遍\n[02:37.86]是岁月善意落下  残缺的悬念\n[02:47.25]\n[02:48.88]如果再见不能红着眼  是否还能红着脸\n[02:54.71]就像那年匆促  刻下永远一起  那样美丽的谣言\n[02:59.99]如果过去还值得眷恋  别太快冰释前嫌\n[03:06.05]谁甘心就这样  彼此无挂也无牵\n[03:11.02]\n[03:11.27]如果再见不能红着眼  是否还能红着脸\n[03:17.53]就像那年匆促  刻下永远一起  那样美丽的谣言\n[03:22.31]如果过去还值得眷恋  别太快冰释前嫌\n[03:28.52]谁甘心就这样  彼此无挂也无牵\n[03:34.15]我们要互相亏欠\n[03:39.73]我们要藕断丝连\n[03:51.48]\n',
    }],
    image: {
        type: 'cover-front',
        mime: 'image/jpeg',
        description: 'e',
        data: buffer // just the cover's binary data
    },
}
```

### parseV1Tag(buffer|uint8Array|number[]) | parseV2Tag(buffer|uint8Array|number[])

Only parse id3v1 tag or id3v2 tag.

## Typescript

The lib is written with Typescript, so typings are shipped with the package.

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.