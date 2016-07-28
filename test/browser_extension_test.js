'use strict';

var grunt = require('grunt');

exports.browser_extension = {
    setUp: function(done) {
        done();
    },
    default_options: function(test) {
        test.ok(grunt.file.isDir('build/chrome'));
        test.ok(grunt.file.isDir('build/firefox'));
        test.ok(grunt.file.isFile('build/firefox/com.browser.extension.xpi'));
        test.ok(grunt.file.isDir('build/safari.safariextension'));
        test.done();
    }
};
