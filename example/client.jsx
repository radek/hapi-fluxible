/* global document */
'use strict';
var React = require('react');
var app = require('./app');
var debug = require('debug');

var dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support
debug.enable('*');

app.rehydrate(dehydratedState, function (err, context) {
  if (err) {
    throw err;
  }
  window.context = context;
  var mountNode = document.getElementById('app');

  debug('React Rendering');
  React.render(app.getAppComponent()({
    context: context.getComponentContext()
  }), mountNode, function () {
    debug('React Rendered');
  });
});
