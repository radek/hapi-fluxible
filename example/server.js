'use strict';

var React = require('react');
var Hapi = require('hapi');
require('node-jsx').install({extension: '.jsx'});

var plugin = require('../');

var server = new Hapi.Server();
server.connection({port: 8000});

server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request, reply) {
    reply('don\'t worry, be hapi!');
  }
});

server.route({
  method: 'GET',
  path: '/js/{param*}',
  handler: {
    directory: {
      path: './public',
      listing: true,
      index: true
    }
  }
});

var fluxOptions = {
  appPath: '../example',
  rootComponent: 'components/Html.jsx'
};

server.register({
  register: plugin,
  options: fluxOptions
}, function logsPluginError( err ) {
  if (err) {
    throw err;
  }
});

server.start(function () {
  console.log('Server running at: ' + server.info.uri);
});

