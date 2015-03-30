'use strict';

var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');
var fetchrPlugin = require('fluxible-plugin-fetchr');

var app = new Fluxible({
  component: React.createFactory(require('./components/App'))
});

app.plug(routrPlugin({
  routes: require('./routes')
}));

app.plug(fetchrPlugin({
  xhrPath: '/api'
}));

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/PageStore'));
app.registerStore(require('./stores/TimeStore'));

module.exports = app;
