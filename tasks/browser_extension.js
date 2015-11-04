/*
 * grunt-browser-extension
 * https://github.com/addmitriev/grunt-browser-extension
 *
 * Copyright (c) 2015 Aleksey Dmitriev
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs-extra');

var pluginRoot = path.join(path.dirname(fs.realpathSync(__filename)), '../');

require('shelljs/global');

module.exports = function (grunt) {


    grunt.registerMultiTask('browser_extension', 'Grunt plugin to create any browser website extension', function () {

        var options = this.options({
            host: '*',
            description: '',
            icons: ''
        });

        var requiredOptionsSet = util.isString(options.directory) &&
            util.isString(options.id) &&
            util.isString(options.name) &&
            util.isString(options.version);

        if (!requiredOptionsSet) {
            grunt.log.error("Please set up all required options. All options must be string value!");
            return false;
        }

        var applicationDir = options.directory;

        if (!grunt.file.isDir(applicationDir)) {
            grunt.log.warn(applicationDir + ' is not a directory.');
            return false;
        }

        var browserFiles = [
            'lib/chrome/manifest.json',
            'lib/firefox/package.json',
            'lib/firefox/lib/index.js',
            'lib/safari/Info.plist'
        ];

        /**
         * Replace application variables in browser dependent files
         */
        browserFiles.forEach(function (fileName) {
            var content = grunt.file.read(path.join(pluginRoot,fileName));

            Object.keys(options).forEach(function (key) {
                var re = new RegExp('%' + key + '%', "gm");
                content = content.replace(re, options[key]);
            });

            grunt.file.write('build/' + fileName, content);
        });

        /**
         * Copy user application files
         */
        grunt.file.expand({cwd: applicationDir}, '**/*').forEach(function (fileName) {
            if (grunt.file.isDir(applicationDir + '/' + fileName)) {
                grunt.file.mkdir('build/lib/chrome/' + fileName);
                grunt.file.mkdir('build/lib/firefox/data/' + fileName);
                grunt.file.mkdir('build/lib/safari/' + fileName);
            } else {


                grunt.file.copy(applicationDir + '/' + fileName, 'build/lib/chrome/' + fileName);
                grunt.file.copy(applicationDir + '/' + fileName, 'build/lib/firefox/data/' + fileName);
                grunt.file.copy(applicationDir + '/' + fileName, 'build/lib/safari/' + fileName);
            }
        });


        /**
         * Building Firefox extension
         */
        var currentDir = pwd();
        cd('build/lib/firefox/');
        exec('jpm xpi &>/dev/null &');
        cd(currentDir);

        /**
         * Prepare Safari extension
         */

        fs.rename('build/lib/safari', 'build/lib/safari.safariextension');

        grunt.log.ok('Extensions are in build directory');

    });

};
