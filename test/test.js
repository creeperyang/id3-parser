'use strict';

var assert = require('assert');
var fs = require('fs');
var http = require('http');

var ID3 = require('../lib/parser.js');
var Promise = require('promise-a-plus');
var expectedV3 = require('./expected/v3.js');
var expectedV2 = require('./expected/v2.js');

var genFilePromise = function(localUrl, remoteUrl) {
    return new Promise(function(resolve, reject) {
        fs.exists(localUrl, function(exists) {
            if(exists) {
                resolve('exists');
            } else {
                var stream = fs.createWriteStream(localUrl);
                stream.on('close', function() {
                    resolve('exists');
                });
                http.get(remoteUrl, function(res) {
                    res.pipe(stream);
                }).on('error', function(e) {
                    reject(e);
                });
            }
        });
    });
};

describe('Test id3-parser', function() {

    describe('music has no id3v1 tag', function() {
        var localUrl = __dirname + '/test-no-v1.mp3';
        var remoteUrl = 'http://7sbnba.com1.z0.glb.clouddn.com/test-no-v1.mp3';
        var filePromise = genFilePromise(localUrl, remoteUrl);

        before(function(done){
            filePromise.then(function(x) {
                done();
            });
            filePromise.catch(function(reason) {
                console.log('Failed to download music file, reason is ', reason);
                console.log('Please download <' + remoteUrl + 
                    '> to test/ dir manually and rename it to "test-no-v1.mp3".');
                console.log('Then try "npm test" again.');

                done('download music file failed');
            });
        });

        describe('#parse(buffer)', function() {
            it('should correctly parse v2.3 tags and identify v1 not exist', function(done) {
                fs.readFile(__dirname + '/expected/cover.jpg', function(err, data) {
                    ID3.parse(fs.readFileSync(localUrl)).then(function(tags) {
                        assert.deepEqual(tags.image.data, data);
                        delete tags.image.data;
                        assert.deepEqual(tags, expectedV2);
                        done();
                    }).catch(function(err) {
                        done(err);
                    });
                });
            });
        });
    });

    describe('music has id3v1 and id3v2.3 tags', function() {
        var localUrl = __dirname + '/test-v1-v2.3.mp3';
        var remoteUrl = 'http://7sbnba.com1.z0.glb.clouddn.com/test-v1-v2.3.mp3';
        var filePromise = genFilePromise(localUrl, remoteUrl);

        before(function(done){
            filePromise.then(function() {
                done();
            });
            filePromise.catch(function(reason) {
                console.log('Failed to download music file, reason is ', reason);
                console.log('Please download <' + remoteUrl + 
                    '> to test/ dir manually and rename it to "test-v1-v2.3.mp3".');
                console.log('Then try "npm test" again.');

                done('download music file failed');
            });
        });

        describe('#parse(buffer)', function() {
            it('should correctly parse v2.3 and v1 tags', function(done) {
                fs.readFile(__dirname + '/expected/cover2.jpg', function(err, data) {
                    ID3.parse(fs.readFileSync(localUrl)).then(function(tags) {
                        assert.deepEqual(tags.image.data, data);
                        delete tags.image.data;
                        assert.deepEqual(tags, expectedV3);
                        done();
                    }).catch(function(err) {
                        done(err);
                    });
                });
            });
        });
    });

});
