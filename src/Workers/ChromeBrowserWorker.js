'use strict';

const BrowserWorker = require('./BrowserWorker');
const WebDriver = require('webdriverio');

const _ = require('lodash');

class ChromeBrowserWorker extends BrowserWorker {
    constructor(scenario) {
        super(scenario);
        this.scenario = scenario;
    }
    setup(done) {
        let BrowserOptions = _.extend({
            host: 'localhost',
            desiredCapabilities: { browserName: 'chrome' }
        }, this.scenario.config.Workers.ChromeBrowser);

        global.Browser = WebDriver.remote(BrowserOptions);

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

module.exports = ChromeBrowserWorker;
