import { IBytes, IID3Tag, ITags } from './interface';
import parseV1Tag from './parsers/v1parser';
import parseV2Tag from './parsers/v2parser';
import polyfill from './polyfill';

polyfill(); // do polyfill.

function parse(bytes: IBytes) {
    const v1data = parseV1Tag(bytes);
    const v2data = parseV2Tag(bytes);
    if (!v2data && !v1data) {
        return false;
    }
    const defaultValue = { version: false };
    const { version: v2, ...v2meta } = v2data || defaultValue;
    const { version: v1, ...v1meta } = v1data || defaultValue;
    const result: IID3Tag = {
        version: {
            v1,
            v2,
        },
        ...v1meta,
        ...v2meta,
    };
    /* tslint:disable:no-any */
    if ((v1meta as ITags).comments) {
        result.comments = [{
            value: (v1meta as ITags).comments,
        }, ...(v2meta && (v2meta as any).comments) ? (v2meta as any).comments : []];
    }
    /* tslint:enable:no-any */
    return result;
}

export {
    parseV1Tag,
    parseV2Tag,
    parse,
};
