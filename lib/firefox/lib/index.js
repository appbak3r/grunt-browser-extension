'use strict';
var data = require('sdk/self').data;
require("sdk/page-mod").PageMod({
    include: "%host%",
    contentScriptFile: [data.url("%injectJS%")],
    contentScriptWhen: 'ready',
    contentStyleFile: [data.url("%injectCSS%")]
});
