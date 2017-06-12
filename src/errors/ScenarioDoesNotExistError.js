'use strict';

class ScenarioDoesNotExistError extends Error {
    constructor() {
        super('The scenario does not exist');
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ScenarioDoesNotExistError;
