'use strict';

const _ = require('lodash');
const async = require('async');

const EventsBus = require('./libs/EventsBus');
const Logger = require('./libs/Logger');
const Scenario = require('./libs/Scenario');
const Util = require('./libs/Util');

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
        this._progress = {};

        EventsBus.listen('syrup:started', (syrup) => {
            this._onProgressUpdate(this._progress);
        });

        EventsBus.listen('scenario:started', (scenario) => {
            this._progress[scenario.name] = 'running';
            this._onProgressUpdate(this._progress);
        });

        EventsBus.listen('scenario:finished', (scenario) => {
            this._progress[scenario.name] = 'finished';
            this._onProgressUpdate(this._progress);

            let index = this._waitingOn.indexOf(scenario.name);

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

        EventsBus.listen('syrup:finished', (syrup) => {
            this._onPourFinished(syrup._report);
        });
    }

    /**
     * Provide a config object for loading
     *
     * @param config
     * @returns {Syrup}
     */
    config(config) {
        this._config = config;

        return this;
    }

    /**
     * Switch debugging on
     *
     * @returns {Syrup}
     */
    debug() {
        this._debugging = true;

        return this;
    }

    /**
     * Provide a method to be called on progress update
     *
     * @param onProgressUpdate
     * @returns {Syrup}
     */
    progress(onProgressUpdate) {
        this._onProgressUpdate = onProgressUpdate;

        return this;
    }

    /**
     * Placeholder method for progress updates
     *
     * @private
     */
    _onProgressUpdate() {

    }

    /**
     * Provide a method to be called on completion of pour
     *
     * @param onPourFinished
     * @returns {Syrup}
     */
    report(onPourFinished) {
        this._onPourFinished = onPourFinished;

        return this;
    }

    /**
     * Placeholder method for pour finished
     *
     * @private
     */
    _onPourFinished() {

    }

    /**
     * Provide a path to a file with globals for registration in each scenario
     *
     * @param path
     * @returns {Syrup}
     */
    globals(path) {
        this._globalsFile = require('path').resolve(path);

        return this;
    }

    /**
     * Define a scenario to be run
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
     * Pour the current syrup setup
     *
     */
    pour() {
        let firstRun = [];

        if (Object.keys(this.scenarios).length === 0) {
            throw new NoScenariosRegisteredError();
        }

        _.each(this.scenarios, (options, name) => {
            this.scenarios[name] = new Scenario(name, Util.deepExtend(options, { globals: this._globalsFile }));
            this.scenarios[name].data = Util.deepExtend(this.scenarios[name].data, this.data);
            this.scenarios[name].config = Util.deepExtend(this.scenarios[name].config, this._config);
            this._progress[name] = 'pending';

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

        EventsBus.emit('syrup:started', {
            scenarios: _.keys(this.scenarios),
            config: this._config
        });

        async.parallel(_.map(firstRun, (name) => (done) => { this.scenarios[name].start(); done(); }));
    }
}

module.exports = Syrup;
