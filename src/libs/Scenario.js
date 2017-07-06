'use strict';

const _ = require('lodash');

const EventsBus = require('./EventsBus');
const Worker = require('./Worker');
const Util = require('./Util');

const ScenarioHasUnresolvedDependenciesError = require('../errors/ScenarioHasUnresolvedDependenciesError');

class Scenario {
    constructor(name, options) {
        this.name = name;
        this.options = _.extend({
                after: [],
                requires: [],
                worker: 'mocha'
            },
            options ? options : {}
        );
        this.report = {};
        this.data = Util.deepExtend({});
        this.config = Util.deepExtend({});
        this._waitingOn = Array.from(this.options.after);
        this._isRunning = false;
        this._isFinished = false;
        this._worker = new Worker(this);

        EventsBus.listen('scenario:finished', (data) => {
            let index = this._waitingOn.indexOf(data.name);

            if (
                this._waitingOn.length > 0 &&
                typeof this._waitingOn[index] !== 'undefined'
            ) {
                this._waitingOn.splice(index, 1);
            }

            this.data = Util.deepExtend(this.data, data.data);

            if (this.canStart()) {
                setTimeout(this.start.bind(this));
            }
        });
    }
    canStart() {
        return  this._waitingOn.length === 0 &&
                this._isRunning === false &&
                this._isFinished === false;
    }
    start() {
        if (this.canStart() === false) {
            throw new ScenarioHasUnresolvedDependenciesError();
        }

        this._isRunning = true;

        EventsBus.emit('scenario:started', this);
        EventsBus.listen('worker:finished', this.finish.bind(this));

        this._worker.start();
    }
    finish(payload) {
        if (this.name === payload.name) {
            this._isFinished = true;
            this.report = payload.report;
            this.data = Util.deepExtend(this.data, payload.scenario.data);
            setTimeout(() => EventsBus.emit('scenario:finished', this));
        }
    }
}

module.exports = Scenario;