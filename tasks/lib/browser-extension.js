/*
 * grunt-browser-extension
 * https://github.com/addmitriev/grunt-browser-extension
 *
 * Copyright (c) 2015 Aleksey Dmitriev
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs-extra');
var path = require('path');
var shell = require('shelljs');

var grunt;


// Prototype for build extensions for each browser
var browserExtension = function (root, options, files) {
    this.root = root;
    this.options = options;
    this.files = files;

    this.browserFiles = {
        chrome: ['manifest.json'],
        firefox: ['package.json', 'lib/index.js'],
        safari: ['Info.plist']
    };
};

// Method for copy files of extension with replace of values
browserExtension.prototype.copyBrowserFiles = function () {
    var self = this;
    var options = this.options;
    var pluginRoot = this.root;
    var browserFiles = this.browserFiles;

    var manifestJS = {
        chrome: (function () {
            return self.files.inject.javascripts.join('", "');
        })(),
        firefox: (function () {
            return self.files.inject.javascripts.join('"), data.url("');
        })(),
        safari: (function () {
            return self.files.inject.javascripts.join("</string>\n\t\t\t\t<string>");
        })()
    };

    var manifestCSS = {
        chrome: (function () {
            return self.files.inject.stylesheets.join('", "');
        })(),
        firefox: (function () {
            return self.files.inject.stylesheets.join('"), data.url("');
        })(),
        safari: (function () {
            return self.files.inject.stylesheets.join("</string>\n\t\t\t<string>");
        })()
    };

    // Process each file from skeletons
    Object.keys(browserFiles).forEach(function (browser) {
        browserFiles[browser].forEach(function (filename) {
            var content = grunt.file.read(path.join(pluginRoot, 'lib', browser, filename));

            // Replace option value in template file
            Object.keys(options).forEach(function (key) {
                var re = new RegExp('%' + key + '%', "gm");
                content = content.replace(re, options[key]);
            });

            var reJS = new RegExp('%injectJS%', "gm");
            var reCSS = new RegExp('%injectCSS%', "gm");

            content = content.replace(reJS, manifestJS[browser]);
            content = content.replace(reCSS, manifestCSS[browser]);

            grunt.file.write(path.join('build', browser, filename), content);
        });
    });
};

browserExtension.prototype.copyUserFiles = function () {
    var applicationDir = this.files.inject.directory;
    var jsFiles = this.files.inject.javascripts;
    var cssFiles = this.files.inject.stylesheets;
    var icon = this.files.icon;


    this._copyFiles(applicationDir, jsFiles);
    this._copyFiles(applicationDir, cssFiles);
    this._makeIcons(applicationDir,icon);

};

browserExtension.prototype._copyFiles = function (applicationDir, files) {

    files.forEach(function (file) {
        grunt.file.expand({cwd: applicationDir}, file).forEach(function (fileName) {
            if (grunt.file.isDir(applicationDir + '/' + fileName)) {
                grunt.file.mkdir('build/chrome/' + fileName);
                grunt.file.mkdir('build/firefox/data/' + fileName);
                grunt.file.mkdir('build/safari/' + fileName);
            } else {
                grunt.file.copy(applicationDir + '/' + fileName, 'build/chrome/' + fileName);
                grunt.file.copy(applicationDir + '/' + fileName, 'build/firefox/data/' + fileName);
                grunt.file.copy(applicationDir + '/' + fileName, 'build/safari/' + fileName);
            }
        });
    });
};

browserExtension.prototype._makeIcons = function (applicationDir, icon) {
    var identifyArgs = ['identify',
        '-format',
        "'{ \"height\": %h, \"width\": %w}'",
        applicationDir + '/' + icon
    ].join(' ');

    var raw = shell.exec(identifyArgs, {silent: true}).output;
    var options = JSON.parse(raw);
    if (options.height !== 128 || options.width !== 128) {
        grunt.fail.fatal("Icon must be 128px x 128px");
        grunt.fail.fatal("Your icon is:", options.height, 'px x ', options.width, 'px');
    }

    var sizes = [16, 48, 64, 128];

    fs.mkdir('build/icons');
    shell.cp(applicationDir + '/' + icon, 'build/icons/icon.png');

    sizes.forEach(function (size) {

        var resizeArgs = [
            'convert',
            applicationDir + '/' + icon,
            '-resize',
            size + 'x' + size,
            'build/icons/icon' + size + '.png'
        ].join(' ');

        shell.exec(resizeArgs, {silent: true});
    });


    this._copyFiles('build/icons', ['*.png']);

};

browserExtension.prototype.build = function () {
    /**
     * Building Firefox extension
     */


    var currentDir = shell.pwd();
    shell.cd('build/firefox/');
    var result = shell.exec('jpm xpi', {silent: true});
    if(result.code !== 0){
        result = shell.exec('../../node_modules/.bin/jpm xpi', {silent: true});
        if(result.code !== 0){
            grunt.fail.fatal('Can not run jpm for build xpi for Firefox');
        }
    }
    shell.cd(currentDir);

    /**
     * Prepare Safari extension
     */

    shell.mv('build/safari', 'build/safari.safariextension');
    shell.rm('-rf', 'build/icons');

    grunt.log.ok('Extensions are in build directory');

};


module.exports = function (gruntModule) {
    grunt = gruntModule;
    return browserExtension;
};
