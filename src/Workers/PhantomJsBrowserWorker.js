'use strict';

const BrowserWorker = require('./BrowserWorker');
const WebDriver = require('webdriverio');

class PhantomJsBrowserWorker extends BrowserWorker {
    constructor(scenario) {
        super(scenario);
    }
    setup(done) {
        if(typeof Browser === 'undefined') {
            global.Browser = WebDriver.remote({
                capabilities: { browserName: 'phantomjs' },
                services: ['phantomjs']
            });
        }

        super.setup(() => {
            Browser.init().then(() => done() , done);
        })
    }
    teardown(done) {
        super.teardown(() => Browser.end().then(() => done() , done)});
    }
}

module.exports = PhantomJsBrowserWorker;
