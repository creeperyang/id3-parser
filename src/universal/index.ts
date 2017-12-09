import { parse } from '../index';
import { IBytes, IID3Tag } from '../interface';
import { convertFileToBuffer, fetchFileAsBuffer } from './helpers';

declare var __GLOBAL__: any;

function getGlobal() {
    let g;
    if (typeof window === 'object' && window.window === window) {
        g = window;
    } else if (typeof global === 'object' && global.global === global) {
        g = global;
    } else {
        // Get global.
        (0, eval)('this.__GLOBAL__ = this;');
        g = __GLOBAL__;
    }
    return g;
}

const GLOBAL = getGlobal();
if (!GLOBAL.Promise) {
    // tslint:disable-next-line:no-var-requires
    GLOBAL.Promise = require('promise-a-plus');
}

export default function uParse(bytes: IBytes | File | string): Promise<IID3Tag> {
    let promise;
    if (GLOBAL.File && bytes instanceof GLOBAL.File) {
        promise = convertFileToBuffer(bytes as File);
    } else if (typeof bytes === 'string') {
        promise = GLOBAL.XMLHttpRequest
            ? fetchFileAsBuffer(bytes)
            : Promise.reject('only browser side support argument as string.');
    } else {
        promise = Promise.resolve(bytes as IBytes);
    }
    return promise.then((arr) => {
        if (!arr || !arr.length) {
            throw new Error('invalid argument, or no enough data.');
        }
        return parse(arr);
    }).then((res) => {
        if (res === false) {
            throw new Error('invalid binary bytes to parse.');
        }
        return res;
    });
}
