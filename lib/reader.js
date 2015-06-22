'use strict';

/*
 * @name: id3 tag parser#Reader
 * @author: creeperyang
 * @date: Tue Jun 16 2015 16:28:35 GMT+0800
*/
var fs = require('fs');
var Promise = require('promise-a-plus');

// With chrome browser, Uint8Array may not have slice method, use subarray instead
if(!('slice' in Uint8Array.prototype)) {
    Uint8Array.prototype.slice = Uint8Array.prototype.subarray;
}

/*
 * Reader Constructor
 *
 * @param {String|File|Buffer|Uint8Array} url - the file url, file or buffer
 * @param {String} type - optional, specify url's type: 1. fileurl(node) 2. ajaxurl(browser) 3. file(browser File) 4. buffer(Buffer or Uint8Array)
*/
function Reader(url, type) {
    var self = this;
    var errMsg;
    var deferred;

    type = type || 'fileurl';
    this.url = url;
    this.type = type;
    this.size = 0;
    deferred = this.bufferDeferred = Promise.deferred();

    if(!url) {
        errMsg = 'emptyUrl';

    // url is local file path
    } else if(type === 'fileurl') {

        fs.readFile(url, function(err, buffer) {
            if(err) {
                return deferred.reject(err);
            }
            self.size = buffer.length;
            deferred.resolve(buffer);
        });

    // url is a Node BUffer object or Uint8Array object
    } else if(type === 'buffer') {
        this.size = url.length;
        if(url instanceof Uint8Array || (typeof Buffer !== 'undefined' && url instanceof Buffer)) {
            deferred.resolve(url);
        } else {
            errMsg = 'notValidBuffer';
        }

    // url is a browser File instance
    } else if(type === 'file') {
        var reader;
        if(typeof File === 'undefined' || !(url instanceof File)) {
            errMsg = 'notValidFile or notInBrowser';
        } else {
            this.size = url.fileSize;
            reader = new FileReader();
            reader.onload = function(e) {
                deferred.resolve(new Uint8Array(e.target.result)); 
            };
            reader.readAsArrayBuffer(url);
        }

    // url is remote file url(fetch data via ajax)
    } else if(type === 'ajaxurl'){
        var ajax;
        if(typeof url !== 'string' || typeof XMLHttpRequest === 'undefined') {
            errMsg = 'notValidAjaxUrl or notInBrowser';
        } else {
            ajax = new XMLHttpRequest();
            ajax.open('GET', url, true);
            ajax.responseType = 'arraybuffer';
            ajax.onload = function(arraybuffer) {
                var u8 = new Uint8Array(arraybuffer);
                self.size = u8.length;
                deferred.resolve(u8);
            };
            ajax.onerror = function(e) {
                deferred.reject(e);
            };
            ajax.send();
        }
    } else {
        errMsg = 'notSupportedType or others';
    }

    if(errMsg) {
        deferred.reject(errMsg);
    }
}

Reader.prototype.read = function(length, offset) {
    var self = this;
    offset = offset || 0;
    return this.bufferDeferred.promise.then(function(buffer) {
        length = length || self.size;
        if(offset < 0) {
            offset += self.size;
        }
        return buffer.slice(offset, offset + length);
    });
};

Reader.prototype.getBuffer = function() {
    return this.bufferDeferred.promise;
};

module.exports = Reader;
