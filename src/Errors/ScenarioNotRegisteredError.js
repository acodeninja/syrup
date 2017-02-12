'use strict';

class ScenarioNotRegisteredError extends Error {
    constructor(test) {
        super('The scenario has not been registered: ' + test);
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ScenarioNotRegisteredError;
