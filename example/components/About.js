/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');

var About = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function() {
    return (
      React.createElement('p', null, 'This is a description of the site.')
    );
  }
});

module.exports = About;
