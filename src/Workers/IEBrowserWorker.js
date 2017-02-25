'use strict';

const BrowserWorker = require('./BrowserWorker');
const WebDriver = require('webdriverio');

const _ = require('lodash');

class IEBrowserWorker extends BrowserWorker {
    constructor(scenario) {
        super(scenario);
    }
    setup(done) {
        let BrowserOptions = _.extend({
            host: 'localhost',
            desiredCapabilities: { browserName: 'internet explorer' }
        }, this.scenario.config.Workers.ChromeBrowser);

        if(typeof Browser === 'undefined') {
            global.Browser = WebDriver.remote(BrowserOptions);
        }

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
