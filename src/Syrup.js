'use strict';

const _ = require('lodash');
const async = require('async');

const EventsBus = require('./libs/EventsBus');
const Scenario = require('./libs/Scenario');
const Logger = require('./libs/Logger');

const ScenarioAlreadyRegisteredError = require('./errors/ScenarioAlreadyRegisteredError');
const NoScenariosRegisteredError = require('./errors/NoScenariosRegisteredError');
const ScenarioDoesNotExistError = require('./errors/ScenarioDoesNotExistError');

class Syrup {
    /**
     * Syrup constructor
     */
    constructor() {
        this.scenarios = {};
        this._config = {};
        this._waitingOn = [];
        this._globalsFile = null;
        this._debugging = false;
    }

    /**
     *
     * @param configuration
     * @returns {Syrup}
     */
    config(config) {
        this._config = config;
        return this;
    }

    debug() {
        this._debugging = true;

        return this;
    }

    /**
     *
     * @param onProgressUpdate
     * @returns {Syrup}
     */
    progress(onProgressUpdate) {
        let scenarios = {};

        EventsBus.listen('syrup:started', (syrup) => {
            _.each(syrup.scenarios, (scenario) => {
                scenarios[scenario] = 'pending';
            });
            onProgressUpdate(scenarios);
        });

        EventsBus.listen('scenario:started', (scenario) => {
            scenarios[scenario.name] = 'running';
            onProgressUpdate(scenarios);
        });

        EventsBus.listen('scenario:finished', (scenario) => {
            scenarios[scenario.name] = 'finished';
            onProgressUpdate(scenarios);
        });

        return this;
    }

    /**
     *
     * @param onPourFinished
     * @returns {Syrup}
     */
    report(onPourFinished) {
        EventsBus.listen('syrup:finished', (syrup) => {
            onPourFinished(syrup);
        });

        return this;
    }

    /**
     *
     * @param path
     * @returns {Syrup}
     */
    globals(path) {
        this._globalsFile = require('path').resolve(path);

        return this;
    }

    /**
     *
     * @param name
     * @param options
     * @returns {Syrup}
     */
    scenario(name, options) {
        if (this.scenarios[name] !== undefined) {
            throw new ScenarioAlreadyRegisteredError();
        }

        this.scenarios[name] = options;
        this._waitingOn.push(name);

        return this;
    }

    /**
     *
     * @param done
     */
    pour(done) {
        let firstRun = [];

        if (Object.keys(this.scenarios).length === 0) {
            throw new NoScenariosRegisteredError();
        }

        _.each(this.scenarios, (options, name) => {
            this.scenarios[name] = new Scenario(name, Util.deepExtend(options, { globals: this._globalsFile }));
            this.scenarios[name].data = Util.deepExtend(this.scenarios[name].data, this.data);
            this.scenarios[name].config = Util.deepExtend(this.scenarios[name].config, this._config);

            _.each(this.scenarios[name].options.after, (scenario) => {
                if (this.scenarios[scenario] === undefined) {
                    throw new ScenarioDoesNotExistError();
                }
            });

            if(this.scenarios[name].canStart()) {
                firstRun.push(name);
            }
        });

        if (this._debugging) {
            new Logger('syrup');
        }

        EventsBus.emit('syrup:started', { scenarios: _.keys(this.scenarios), config: this._config });

        EventsBus.listen('scenario:finished', (payload) => {
            let index = this._waitingOn.indexOf(payload.name);

            if (
                this._waitingOn.length > 0 &&
                typeof this._waitingOn[index] !== 'undefined'
            ) {
                this._waitingOn.splice(index, 1);
            }

            if (this._waitingOn.length === 0) {
                setTimeout(() => EventsBus.emit('syrup:finished', this));
            }
        });

        async.parallel(_.map(firstRun, (name) => (done) => { this.scenarios[name].start(); done(); }));
    }
}

module.exports = Syrup;
