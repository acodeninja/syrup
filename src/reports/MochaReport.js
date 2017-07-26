'use strict';

const _ = require('lodash');
const Report = require('./Report');

class MochaReport extends Report {
    constructor(payload) {
        super(payload);
        this._parsedReport.stats = {
            tests: this._rawReport.stats.tests,
            passes: this._rawReport.stats.passes,
            failures: this._rawReport.stats.failures,
            timeStart: this._rawReport.stats.start,
            timeEnd: this._rawReport.stats.end,
            duration: this._rawReport.stats.duration
        };
        this._parsedReport.tests = [];

        this.processReport();
    }
    processReport() {
        _.each(this._rawReport.tests, (test) => {
            this._parsedReport.tests.push({
                title: test.fullTitle,
                titleShort: test.title,
                status: this.getTestStatus(test),
                duration: test.duration,
                error: test.err
            });
        });
    }
    getTestStatus(test) {
        if (false === _.isEmpty(test.err)) {
            return 'fail';
        }
        return 'pass';
    }
}

module.exports = MochaReport;
