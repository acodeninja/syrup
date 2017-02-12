'use strict';

class ScenarioTypeError extends Error {
    constructor() {
        super('The expected type is Scenario');
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ScenarioTypeError;
