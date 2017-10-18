var GLOBAL;
if (typeof window === 'object' && window.window === window) {
    GLOBAL = window;
    // Create a namespace to attach parse to window if in browser
    GLOBAL.ID3 = {};
} else if (typeof global === 'object' && global.global === global) {
    GLOBAL = global;
} else {
    GLOBAL = this;
}

// Within v8 engine, Uint8Array may not have slice method, use subarray instead
if(!('slice' in Uint8Array.prototype)) {
    Uint8Array.prototype.slice = Uint8Array.prototype.subarray;
}

module.exports = GLOBAL;
