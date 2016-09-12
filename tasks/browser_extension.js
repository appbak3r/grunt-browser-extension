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


module.exports = function (grunt) {
    var BrowserExtension = require('./lib/browser-extension')(grunt);

    grunt.registerMultiTask('browser_extension', 'Grunt plugin to create any browser website extension', function () {
        var options = this.options();
        var requiredOptionsSet = util.isString(options.variables.id) &&
            util.isString(options.variables.name) &&
            util.isString(options.variables.author) &&
            util.isString(options.variables.description) &&
            util.isString(options.variables.host) &&
            util.isString(options.variables.version);

        if (!requiredOptionsSet) {
            grunt.fail.fatal("Please set up all required options. All options must be string value!");
        }
        var pluginRoot = path.join(path.dirname(fs.realpathSync(__filename)), '../');
        var bExt = new BrowserExtension(pluginRoot, options.variables, options.files, grunt);

        bExt.copyBrowserFiles();
        bExt.copyUserFiles();
        bExt.build();
    });
};
