declare module 'id3-parser' {
    export function parse(file: File | Uint8Array | Buffer): PromiseLike<Partial<Tags>>;

    export interface Tags {
        /*
        * Textual frames
        */
        'album': string,
        'bpm': string,
        'composer': string,
        'genre': string,
        'copyright': string,
        'encoding-time': string,
        'playlist-delay': string,
        'original-release-time': string,
        'recording-time': string,
        'release-time': string,
        'tagging-time': string,
        'encoder': string,
        'writer': string,
        'file-type': string,
        'involved-people': string,
        'content-group': string,
        'title': string,
        'subtitle': string,
        'initial-key': string,
        'language': string,
        'length': string,
        'credits': string,
        'media-type': string,
        'mood': string,
        'original-album': string,
        'original-filename': string,
        'original-writer': string,
        'original-artist': string,
        'owner': string,
        'artist': string,
        'band': string,
        'conductor': string,
        'remixer': string,
        'set-part': string,
        'produced-notice': string,
        'publisher': string,
        'track': string,
        'radio-name': string,
        'radio-owner': string,
        'album-sort': string,
        'performer-sort': string,
        'title-sort': string,
        'isrc': string,
        'encoder-settings': string,
        'set-subtitle': string,
        'user-defined-text-information': string,
        'year': string,

        /*
         * URL frames
         */
        'url-commercial': string,
        'url-legal': string,
        'url-file': string,
        'url-artist': string,
        'url-source': string,
        'url-radio': string,
        'url-payment': string,
        'url-publisher': string,
        'url-copyright': string,

        /*
         * Comment frame
         */
        'comments': string,
        'lyrics': string,

        version: VersionInfo
        image: Image,
    }

    export interface VersionInfo {
        v1: v1VersionInfo,
        v2: v2VersionInfo
    }

    export interface v1VersionInfo {
        major: number,
        minor: number
    }

    export interface v2VersionInfo extends v1VersionInfo {
        revision: number,
        flags: Flags
    }

    export interface Flags {
        unsync: number,
        xheader: number,
        experimental: number
    }

    export interface Image {
        type: string,
        mime: string,
        imageType: string,
        descriptions: string
    }
}
