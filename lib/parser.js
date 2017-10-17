'use strict';

var GLOBAL = require('./global.js');
if (!GLOBAL.Promise) {
    GLOBAL.Promise = require('promise-a-plus');
}

var parser = require('./parser-non-polyfilled.js');

// Attach parse to global namespace
if (GLOBAL.ID3 !== undefined) {
    GLOBAL.ID3.parse = parser.parse;
}

module.exports = parser;
