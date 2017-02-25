'use strict';

class ConfigNotFoundError extends Error {
    constructor(path) {
        super('Could not find the config file at: ' + path);
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ConfigNotFoundError;
