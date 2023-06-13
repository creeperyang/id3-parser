

export function convertFileToBuffer(file: File): Promise<Uint8Array> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(new Uint8Array(reader.result as ArrayBuffer));
        };
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

export function fetchFileAsBuffer(url: string): Promise<Uint8Array> {
    if (!url) {
        throw new Error('Argument should be a valid url string.');
    }
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            if (request.response) {
                resolve(new Uint8Array(request.response));
            } else {
                reject(new Error('Empty XMLHttpRequest response.'));
            }
        };
        request.onerror = (e) => reject(e);
        request.send();
    });
}
