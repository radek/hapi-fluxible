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
var Promise = require('bluebird');


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

  server.ext('onPostHandler', function (req, reply) {
    var context = app.createContext({
      req: req
    });

    var actionContext = context.getActionContext();
    var fetchrPlugin = app.getPlugin('FetchrPlugin');

    // simple implementation of response (express like)
    var response = {
      statusCode: null,
      status: function (status) {
        this.statusCode = status;
        return this;
      },
      send: function (data) {
        if (this.statusCode) {
          reply(data).code(this.statusCode);
          return this;
        }
        reply(data);
        return this;
      },
      json: function (respObj) {
        return this.send(respObj);
      },
      end: function () {
        reply.continue();
        return this;
      }
    };

    // first will check if request should be handled by fetcher middleware
    var runFetchrHandlers = function () {
      return new Promise(function(resolve, reject) {
        var middleware = fetchrPlugin.getMiddleware();
        if (req.path.indexOf(fetchrPlugin.getXhrPath()) === 0) {
          req.method = req.method.toUpperCase(); // align with express naming
          middleware(req, response, next);
          resolve(true);
        }
        resolve();
      });
    };

    runFetchrHandlers().then(function(apiResponse){

      if (apiResponse) {
        return;
      }

      actionContext.executeAction(navigateAction, {
          url: req.path
        }, function (err) {
          if (err) {
            if (err.status && err.status === 404) {
              return reply.continue();
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

          return reply(options.doctype + html);

        });

    }).catch(function(err) {
      next(err);
    });


  });
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
