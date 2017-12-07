export interface IStringStringMap { [key: string]: string; }
export interface IStringAnyMap { [key: string]: any; }

export type IBytes = number[] | Buffer | Uint8Array;
// TXXX frame
export interface ITXXXMap {
    description: null | string;
    value: null | string;
}
// COMM frame, comment from ID3v1 will only have value key.
export interface ICOMMMap {
    language?: null | string;
    description?: null | string;
    value: null | string;
}

export interface IFlags {
    unsync: boolean;
    xheader: boolean;
    experimental: boolean;
}

export interface IImage {
    type: string;
    mime: string;
    descriptions: string;
    data: ArrayLike<number>;
}

export interface IV1VersionInfo {
    major: number;
    minor: number;
}

export interface IV2VersionInfo extends IV1VersionInfo {
    revision: number;
    flags: IFlags;
}

export interface IVersionInfo {
    v1: boolean | IV1VersionInfo;
    v2: boolean | IV2VersionInfo;
}

export interface ITags extends IStringAnyMap {
    /*
    * Textual frames
    */
    'album'?: string;
    'bpm'?: string;
    'composer'?: string;
    'genre'?: string;
    'copyright'?: string;
    'encoding-time'?: string;
    'playlist-delay'?: string;
    'original-release-time'?: string;
    'recording-time'?: string;
    'release-time'?: string;
    'tagging-time'?: string;
    'encoder'?: string;
    'writer'?: string;
    'file-type'?: string;
    'involved-people'?: string;
    'content-group'?: string;
    'title'?: string;
    'subtitle'?: string;
    'initial-key'?: string;
    'language'?: string;
    'length'?: string;
    'credits'?: string;
    'media-type'?: string;
    'mood'?: string;
    'original-album'?: string;
    'original-filename'?: string;
    'original-writer'?: string;
    'original-artist'?: string;
    'owner'?: string;
    'artist'?: string;
    'band'?: string;
    'conductor'?: string;
    'remixer'?: string;
    'set-part'?: string;
    'produced-notice'?: string;
    'publisher'?: string;
    'track'?: string | number;
    'radio-name'?: string;
    'radio-owner'?: string;
    'album-sort'?: string;
    'performer-sort'?: string;
    'title-sort'?: string;
    'isrc'?: string;
    'encoder-settings'?: string;
    'set-subtitle'?: string;
    'user-defined-text-information'?: ITXXXMap[];
    'year'?: string;

    /*
     * URL frames
     */
    'url-commercial'?: string;
    'url-legal'?: string;
    'url-file'?: string;
    'url-artist'?: string;
    'url-source'?: string;
    'url-radio'?: string;
    'url-payment'?: string;
    'url-publisher'?: string;
    'url-copyright'?: string;

    /*
     * Comment frame
     */
    'comments'?: ICOMMMap[] | string;
    'lyrics'?: ICOMMMap[];

    /**
     * other frames
     */
    'involved-people-list'?: string;
    'ownership'?: IStringStringMap;

    // image
    image?: IImage;
}

export interface IID3V1Tag extends ITags {
    version: IV1VersionInfo;
}

export interface IID3V2Tag extends ITags {
    version: IV2VersionInfo;
}

export interface IID3Tag extends ITags {
    version: IVersionInfo;
}
