'use strict';

var assert = require('assert'),
  Hapi = require('hapi'),
  React = require('react'),
  plugin = require('../');

require('node-jsx').install({extension: '.jsx'});

var routes = require('../example/routes');

describe('hapi-fluxible', function() {

  var server;
  var heloRoute = [{
    method: 'GET',
    path: '/hello',
    handler: function(request, reply) {
      return reply('don\'t worry, be hapi!');
    }
  }];

  var options = {
    rootComponent: '../example/components/Html',
    fluxApp: '../example/app'
  };

  beforeEach(function () {
    server = new Hapi.Server();
    server.connection({ port: 8000});
    server.route(heloRoute);
  });

  it('loads successfully', function(done) {
    server.register({register: plugin, options: options}, function(err) {
      assert.ok(!err);
      done();
    });
  });

  it('adds a route to /hello', function(done) {
    var table;

    server.register({register: plugin, options: options}, function() {

      table = server.table();
      assert.ok(table);
      assert.equal(table.length, 1);
      assert.equal(table[0].table[0].path, '/hello');

      done();
    });
  });

  it('responses to GET request on /hello', function(done) {
    var request = {
      method: 'GET',
      url: '/hello'
    };

    server.register({register: plugin, options: options}, function(){
      server.inject(request, function (res){
        assert.equal(res.statusCode, 200);
        assert.equal(res.result, 'don\'t worry, be hapi!');
        done();
      });
    });

  });

  it('fluxible routes render page', function(done) {
    var request = {
      method: 'GET',
      url: '/about',
      routeName: 'about'
    };

    server.register({register: plugin, options: options}, function() {

      server.inject(request, function (res){
        var tester1 = new RegExp('^<!DOCTYPE');
        var tester2 = new RegExp('.*\<body');
        assert.equal(res.statusCode, 200);
        assert.equal(tester1.test(res.result), true);
        assert.equal(tester2.test(res.result), true);
        done();
      });
    });
  });

});
