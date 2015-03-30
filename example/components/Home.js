/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');

var Home = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function() {
    return (
      React.createElement('p', null, 'Welcome to the site!')
    );
  }
});

module.exports = Home;
