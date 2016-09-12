# grunt-browser-extension
[![npm version](https://badge.fury.io/js/grunt-browser-extension.svg)](https://badge.fury.io/js/grunt-browser-extension)
[![Build Status](https://travis-ci.org/addmitriev/grunt-browser-extension.svg?branch=master)](https://travis-ci.org/addmitriev/grunt-browser-extension)
> Grunt plugin to create any browser website extension

## Getting Started
This plugin requires Grunt `~0.4.5` and `imagemagick` installed on your system

To install imagemagick you can run next command (OSx):

```shell
brew install imagemagick
```

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-browser-extension --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-browser-extension');
```

## The "browser_extension" task

### Overview
In your project's Gruntfile, add a section named `browser_extension` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  browser_extension: {
    options: {
      // Task-specific options go here.
    },
  },
});
```

### Options


```js
grunt.initConfig({
  browser_extension: {
     default: {
        options: {
           variables: {
               id: 'com.browser.extension', // required application id for Safari and Firefox
               name: 'Browser extension', // required application name
               version: '0.1.0', // required application version
               host: '*.google.com', // required match host, default is *
               description: 'browser extension', // required  description
               author: 'Aleksey Dmitriev' // required Author
           },
           files: {
               inject: {
                   directory: 'application', // path to your application files
                   javascripts: ['app.min.js', 'extension.js'], // list of js files relative to application directory
                   stylesheets: ['styles.css', 'module.css'] // list of css files relative to application directory
               },
               icon: 'application/icon.png' // path to application icon
           }
        }
       }
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
