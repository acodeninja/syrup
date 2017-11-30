'use strict';

const _ = require('lodash');
const WebDriver = require('webdriverio');
const BrowsertStack = require('browserstack-local');
const BrowsertStackLocal = new BrowsertStack.Local();
const EventsBus = require('../libs/EventsBus');

module.exports = {
    up: (done, options) => {
        if (
              options.desiredCapabilities['browserstack.local']
        ) {
            new Promise(function(resolve, reject) {
                BrowsertStackLocal.start({
                    'key': options.key
                }, function(error) {
                    if (error) return reject(error);
                    resolve();
                });
            }).then(() => {
                module.exports.connect(done, options);
            });
        } else {
            module.exports.connect(done, options);
        }
    },
    connect: (done, options) => {
        global.Browser = WebDriver.remote(_.extend({}, options));

        Browser.init().then(() => {
            EventsBus.emit('browser:started');
            done();
        }, (err) => {
            done(err);
        });
    },
    down: (done, options) => {
        Browser.end().then(() => {done()}, () => {done();});
        BrowsertStackLocal.stop(function() {});
    }
};
