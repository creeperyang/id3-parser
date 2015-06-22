'use strict';

var assert = require('assert');
var fs = require('fs');
var http = require('http');

var ID3 = require('../lib/parser.js');
var Reader = ID3.Reader;
var Promise = require('promise-a-plus');
var expected = require('./expected.js');

describe('Test id3-parser', function() {

    var url = __dirname + '/test.mp3';
    var reader;
    var filePromise = new Promise(function(resolve, reject) {
        fs.exists(url, function(exists) {
            if(exists) {
                resolve('exists');
            } else {
                var stream = fs.createWriteStream(url);
                stream.on('close', function() {
                    resolve('exists');
                });
                http.get("http://7sbnba.com1.z0.glb.clouddn.com/music-test.mp3", function(res) {
                    res.pipe(stream);
                }).on('error', function(e) {
                    reject(e);
                });
            }
        });
    });

    beforeEach(function(done){
        filePromise.then(function() {
            reader = reader || new Reader(url);
            done();
        });
        filePromise.catch(function(reason) {
            console.log('Failed to resolve test.mp3(the file to parse id3), reason is ', reason);
            console.log('Please download <http://7sbnba.com1.z0.glb.clouddn.com/music-test.mp3> to test/ dir manually and rename it to "test.mp3".');
            console.log('Then try "npm test" again.');

            done('download "test.mp3" failed');
        });
    });

    describe('#new Reader()', function() {

        it('should correctly return a reader', function(done) {
            
            reader.bufferDeferred.promise.then(function(buffer) {
                assert.equal(reader.type, 'fileurl');
                assert.equal(reader.size, 3892269);
                assert.equal(reader.url, url);
                fs.readFile(url, function(err, data) {
                    assert.deepEqual(data, buffer);
                    done();
                });
            });

        });

    });

    describe('#parse(reader)', function() {

        it('should correctly parse v2.1 and v2.3 tags', function(done) {

            fs.readFile(__dirname + '/cover.jpg', function(err, data) {
                ID3.parse(reader).then(function(tags) {
                    assert.deepEqual(tags.image.data, data);
                    delete tags.image.data;
                    assert.deepEqual(tags, expected);
                    done();
                });
            });

        });

    });

});
