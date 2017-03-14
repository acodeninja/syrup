'use strict';

class ScenarioInputInvalid extends Error {
    constructor(scenarioInputOptions) {
        super('The input is not valid, name and entrypoint are required: ' + JSON.stringify(scenarioInputOptions));
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ScenarioInputInvalid;
