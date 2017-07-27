'use strict';

const _ = require('lodash');

const EventsBus = require('./EventsBus');
const Worker = require('./Worker');
const Util = require('./Util');

const ScenarioHasUnresolvedDependenciesError = require('../errors/ScenarioHasUnresolvedDependenciesError');

const workers = {
    'mocha': 'Mocha'
};

class Scenario {
    constructor(name, options) {
        this.options = _.extend({
                after: [],
                requires: [],
                worker: 'mocha'
            },
            options ? options : {}
        );

        this.name = name;
        this.description = options.description === undefined ? '' : options.description;
        this.options.worker = workers[this.options.worker];

        this.data = Util.deepExtend({});
        this.config = Util.deepExtend({});
        this._waitingOn = Array.from(this.options.after);
        this._isRunning = false;
        this._isFinished = false;
        this._worker = new Worker(this);
        this._reporter = require(`../reports/${this.options.worker}Report`);

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
        if (this.name === payload.name && false === this._isFinished) {
            this._isFinished = true;
            this.data = Util.deepExtend(this.data, payload.scenario.data);
            let report = new this._reporter(payload);
            this.report = report.getReport();
            EventsBus.emit('scenario:finished', this);
        }
    }
}

module.exports = Scenario;
