'use strict';
/**
 * fetch file from remote
 * It's not part of id3-parser lib. In fact it's just a standalone util for those who use parser in browser 
 * and want to load music file from remote server.
 * 
 * @author: creeperyang
 */

var Promise = Promise || require('promise-a-plus');

function ajax(options) {
    var deferred = Promise.defer();
    var type = typeof options;
    var request, url;
    if(!options || (type !== 'string' && type !== 'object')) {
        deferred.reject('invalid args');
    } else {
        request = new XMLHttpRequest();
        if(type === 'string') {
            url = options;
        } else {
            url = options.url;
        }
        request.open('GET', url, true);
        request.responseType = options.responseType || 'arraybuffer';
        request.onload = function(res) {
            deferred.resolve(res);
        };
        request.onerror = function(e) {
            deferred.reject(e);
        };
        request.send();
    }
    return deferred.promise;
}

// expose ajax to global object if in browser
if(typeof window !== 'undefined' && window.window === window) {
    window.ajax = ajax;
}

module.exports = ajax;