'use strict';

class ScenarioHasUnresolvedDependenciesError extends Error {
    constructor() {
        super('The scenario has unresolved dependencies');
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

module.exports = ScenarioHasUnresolvedDependenciesError;
