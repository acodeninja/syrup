'use strict';

const BrowserWorker = require('./BrowserWorker');
const WebDriver = require('webdriverio');

class IEBrowserWorker extends BrowserWorker {
    constructor(scenario) {
        super(scenario);
    }
    setup(done) {
        let BrowserOptions = { browserName: 'internet explorer' };

        global.Browser = WebDriver.remote({
            host: '192.168.140.5',
            desiredCapabilities: BrowserOptions
        });

        super.setup(() => {
            Browser.init({
                desiredCapabilities: BrowserOptions
            }).then(() => done(), done);
        });
    }
    teardown(done) {
        super.teardown(() => Browser.end().then(() => done()));
    }
}

module.exports = IEBrowserWorker;
