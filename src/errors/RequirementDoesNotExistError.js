'use strict';

class RequirementDoesNotExistError extends Error {
    constructor(name) {
        super(`The given requirement does not exist: ${name}`);
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = RequirementDoesNotExistError;
