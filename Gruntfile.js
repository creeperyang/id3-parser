'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            browser: {
                files: {
                    'id3-parser.browser.js': ['lib/parser.js']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'lib/{,*/}*.js'
                ]
            }
        },
        uglify: {
            options: {
                mangle: true,
                beautify: false,
                sourceMap: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + 
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            browser: {
                files: {
                    'id3-parser.browser.min.js': 'id3-parser.browser.js'
                }
            }
        }
    });

    grunt.registerTask('build', [
        'jshint',
        'browserify',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);

};
