'use strict';

const BrowserWorker = require('./BrowserWorker');
const WebDriver = require('webdriverio');

class FirefoxBrowserWorker extends BrowserWorker {
    constructor(scenario) {
        super(scenario);
    }
    setup(done) {
        let BrowserOptions = {
            capabilities: { browserName: 'firefox' },
            host: '192.168.140.5'
        };

        if(typeof Browser === 'undefined') {
            global.Browser = WebDriver.remote(BrowserOptions);
        }

        super.setup(() => {
            Browser.init(BrowserOptions).then(() => done() , done);
        });
    }
    teardown(done) {
        super.teardown(() => Browser.end().then(() => done()));
    }
}

module.exports = FirefoxBrowserWorker;
