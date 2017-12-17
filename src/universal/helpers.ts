type fun = (arg: any) => void;

export function convertFileToBuffer(file: File): Promise<Uint8Array> {
    const reader = new FileReader();
    let fulfill: fun;
    let refuse: fun;
    const promise = new Promise!((resolve: fun, reject: fun) => {
        fulfill = resolve;
        refuse = reject;
    });
    reader.onload = () => fulfill(new Uint8Array(reader.result));
    reader.onerror = (e) => refuse(e);
    reader.readAsArrayBuffer(file);
    return promise;
}

export function fetchFileAsBuffer(url: string): Promise<Uint8Array> {
    if (!url) {
        throw new Error('Argument should be valid url string.');
    }
    let fulfill: fun;
    let refuse: fun;
    const promise = new Promise!((resolve: fun, reject: fun) => {
        fulfill = resolve;
        refuse = reject;
    });
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        if (request.response) {
            fulfill(new Uint8Array(request.response));
        } else {
            refuse('Empty response or other exceptions.');
        }
    };
    request.onerror = (e) => refuse(e);
    request.send();

    return promise;
}
