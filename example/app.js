'use strict';

var React = require('react');
var Fluxible = require('fluxible');
var routrPlugin = require('fluxible-plugin-routr');

var app = new Fluxible({
  appComponent: React.createFactory(require('./components/App.jsx'))
});

app.plug(routrPlugin({
  routes: require('./routes')
}));

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/PageStore'));
app.registerStore(require('./stores/TimeStore'));

module.exports = app;
