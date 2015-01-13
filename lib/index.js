/*
 * hapi-flux-router
 * https://github.com/radek/hapi-flux-router
 *
 * Copyright (c) 2014 Radek
 * Licensed under the MIT license.
 *
 *
 */

'use strict';
var path = require('path');

var React = require('react');
var _merge = require('lodash.merge');
var serialize = require('serialize-javascript');
var navigateAction = require('flux-router-component').navigateAction;


var DEFAULT_OPTIONS = {
  doctype: '<!DOCTYPE html>',
  appPath: './',
  rootComponent: 'components/Html.jsx',
  fluxApp: 'app.js'
};

exports.register = function (server, options, next) {
  options = _merge (DEFAULT_OPTIONS, options);

  var fluxApp = path.join(options.appPath, options.fluxApp);
  var rootComponent = path.join(options.appPath, options.rootComponent);
  var app;
  var component;

  try {
    app = require(fluxApp);
  } catch (e) {
    return function() {
      throw e;
    };
  }

  try {
    component = React.createFactory(require(rootComponent));
  } catch (e) {
    return function() {
      throw e;
    };
  }

  server.ext('onPostHandler', function (request, replay) {
    var context = app.createContext();

    context.getActionContext().executeAction(navigateAction, {
        url: request.path
    }, function (err) {
      if (err) {
        if (err.status && err.status === 404) {
          return replay.continue();
        }
        next(err);
      }

      var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

      var appComponent = app.getAppComponent();
      var html = React.renderToStaticMarkup(component({
          state: exposed,
          context: context.getComponentContext(),
          markup: React.renderToString(appComponent({
            context: context.getComponentContext()
          }))
      }));

      return replay(options.doctype + html);
    });
  });
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
