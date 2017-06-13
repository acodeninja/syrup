'use strict';

const WebDriver = require('webdriverio');
const _ = require('lodash');

const EventsBus = require('../libs/EventsBus');

module.exports = (done, options) => {
    global.Browser = WebDriver.remote(_.extend({}, options));

    Browser.init().then(() => {
        EventsBus.emit('browser:started');
        done();
    }, (err) => {
        done(err);
    });
};
