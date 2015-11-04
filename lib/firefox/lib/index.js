var data = require('sdk/self').data,
    url = require('sdk/url');

require("sdk/page-mod").PageMod({
  include: "%host%",
  contentScriptFile: [data.url('app.min.js')],
  contentScriptWhen: 'ready',
  contentStyleFile: data.url('styles.css')
});