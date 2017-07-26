'use strict';

class NoScenariosRegisteredError extends Error {
    constructor() {
        super('No scenarios have been registered');
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = NoScenariosRegisteredError;
