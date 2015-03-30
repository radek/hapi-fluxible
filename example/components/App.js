/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var Fluxible = require('fluxible');
var RouterMixin = require('flux-router-component').RouterMixin;
var Home = React.createFactory(require('./Home'));
var About = React.createFactory(require('./About'));
var Page = React.createFactory(require('./Page'));
var Nav = React.createFactory(require('./Nav.jsx'));
var Timestamp = React.createFactory(require('./Timestamp'));

/**
 * React class to handle the rendering of the HTML head section
 *
 * @class App
 * @constructor
 */
var App = React.createClass({
  mixins: [RouterMixin, Fluxible.FluxibleMixin],
  statics: {
    storeListeners: [ApplicationStore]
  },

  displayName: 'AppComponent',

  getInitialState: function () {
    return this.getStore(ApplicationStore).getState();
  },

  onChange: function () {
    var state = this.getStore(ApplicationStore).getState();
    this.setState(state);
  },

  /**
   * Refer to React documentation render
   *
   * @method render
   * @return {Object} HTML head section
   */
  render: function() {

    var output = '';
    switch (this.state.currentPageName) {
      case 'home':
        output = Home({context: this.props.context});
        break;
      case 'about':
        output = About({context: this.props.context});
        break;
      case 'page':
        output = Page({context: this.props.context});
        break;
    }
    return (
      React.createElement('div', null, Nav({selected: this.state.currentPageName, links: this.state.pages, context: this.props.context}), output, Timestamp({context: this.props.context}))
    );
  },

  componentDidUpdate: function(prevProps, prevState) {
    var newState = this.state;
      if (newState.pageTitle === prevState.pageTitle) {
        return;
      }
      document.title = newState.pageTitle;
    }
});

module.exports = App;
