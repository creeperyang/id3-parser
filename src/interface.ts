export interface IStringStringMap { [key: string]: string; }
export interface IStringAnyMap { [key: string]: any; }

export type IBytes = number[] | Buffer | Uint8Array;

export interface IFlags {
    unsync: boolean;
    xheader: boolean;
    experimental: boolean;
}

export interface IImage {
    type: string;
    mime: string;
    imageType: string;
    descriptions: string;
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
    v1: IV1VersionInfo;
    v2: IV2VersionInfo;
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
    'user-defined-text-information'?: string;
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
    'comments'?: string;
    'lyrics'?: string;

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
