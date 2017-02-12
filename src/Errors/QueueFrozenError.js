'use strict';

class QueueFrozenError extends Error {
    constructor() {
        super('The queue has been frozen, you can no longer add new scenarios.');
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = QueueFrozenError;
