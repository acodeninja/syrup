'use strict';

class Report {
    constructor(payload) {
        this._rawReport = payload.report;
        this._parsedReport = {
            name: payload.scenario.name,
            description: payload.scenario.description
        };
    }
    getReport() {
        return this._parsedReport;
    }
}

module.exports = Report;
