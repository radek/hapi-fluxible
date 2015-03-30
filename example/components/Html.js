/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');

/**
 * React class to handle the rendering of the HTML head section
 *
 * @class Html
 * @constructor
 */
var Html = React.createClass({
  /**
   * Refer to React documentation render
   *
   * @method render
   * @return {Object} HTML head section
   */
  render: function() {
    return (
      React.createElement('html', null,
        React.createElement('meta', {charSet: 'utf-8'}),
        React.createElement('meta', {name: 'viewport', content: 'width=device-width, user-scalable=no'}),
        React.createElement('title', null, this.props.context.getStore(ApplicationStore).getPageTitle()),
        React.createElement('link', {rel: 'stylesheet', href: 'http://yui.yahooapis.com/pure/0.5.0/pure-min.css'}),
        React.createElement('body', {id: 'app', dangerouslySetInnerHTML: {__html: this.props.markup}}),
        React.DOM.script({dangerouslySetInnerHTML: {__html: this.props.state}}),
        React.createElement('script', {src: '/js/bundle.js', defer: 'defer'})
      )
    );
  }
});

module.exports = Html;
