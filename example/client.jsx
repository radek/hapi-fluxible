/* global document */
"use strict";
var React = require('react');
var app = require('./app');

var dehydratedState = window.App; // Sent from the server

window.React = React; // For chrome dev tool support

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }
    window.context = context;
    var mountNode = document.getElementById('app');

    console.log('React Rendering');
    React.render(app.getAppComponent()({
        context: context.getComponentContext()
    }), mountNode, function () {
        console.log('React Rendered');
    });
});
