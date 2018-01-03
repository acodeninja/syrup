'use strict';

const _ = require('lodash');
const WebDriver = require('webdriverio');
const EventsBus = require('../libs/EventsBus');

module.exports = {
    up: (done, options) => {
        global.Browser = WebDriver.remote(_.extend({}, options));

        Browser.init().then(() => {
            EventsBus.emit('browser:started');
            Browser.windowHandleMaximize();
            done();
        }, (err) => {
            done(err);
        });
    },
    down: (done, options) => {
        Browser.end().then(() => {done()}, () => {done();});
    }
};
