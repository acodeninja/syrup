'use strict';

class ScenarioAlreadyRegisteredError extends Error {
    constructor() {
        super('The scenario has already been registered');
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ScenarioAlreadyRegisteredError;
