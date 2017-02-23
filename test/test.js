'use strict';

var assert = require('assert');
var fs = require('fs');

var ID3 = require('../lib/parser.js');
var expectedV3 = require('./expected/v3.js');
var expectedV2 = require('./expected/v2.js');

describe('Test id3-parser', function() {
    it('should correctly handle invalid argument', function(done) {
        ID3.parse('invalid').then(function() {
            done('should not be invoked');
        }).catch(function(err) {
            assertError(err);
            return ID3.parse().then(function() {
                done('should not be invoked');
            });
        }).catch(function(err) {
            assertError(err);
            return ID3.parse(null).then(function() {
                done('should not be invoked');
            });
        }).catch(function(err) {
            assertError(err);
            return ID3.parse(1).then(function() {
                done('should not be invoked');
            });
        }).catch(function(err) {
            assertError(err);
            done();
        });

        function assertError(err) {
            assert.ok(err instanceof TypeError);
            assert.strictEqual(err.message, 'argument should be instance of Buffer|Uint8Array|File');
        }
    });
    it('should correctly handle invalid buffer', function(done) {
        ID3.parse(fs.readFileSync(__dirname + '/test-no-v1.mp3').slice(0, 10))
            .then(function(tags) {
                assert.deepEqual({
                    version: false
                }, tags);
                done();
            }).catch(done);
    });
    it('should correctly parse v2.3 tags and identify v1 not exist', function(done) {
        fs.readFile(__dirname + '/expected/cover.jpg', function(err, data) {
            ID3.parse(fs.readFileSync(__dirname + '/test-no-v1.mp3'))
                .then(function(tags) {
                    assert.deepEqual(tags.image.data, data);
                    delete tags.image.data;
                    assert.deepEqual(tags, expectedV2);
                    done();
                }).catch(done);
        });
    });
    it('should correctly parse v2.3 and v1 tags', function(done) {
        fs.readFile(__dirname + '/expected/cover2.jpg', function(err, data) {
            ID3.parse(fs.readFileSync(__dirname + '/test-v1-v2.3.mp3'))
                .then(function(tags) {
                    assert.deepEqual(tags.image.data, data);
                    delete tags.image.data;
                    assert.deepEqual(tags, expectedV3);
                    done();
                }).catch(done);
        });
    });
});