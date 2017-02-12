'use strict';

// Extended Worker class
const Worker = require('./Worker');

class BrowserWorker extends Worker {
    constructor(scenario) {
        super(scenario);
    }
}

module.exports = BrowserWorker;
