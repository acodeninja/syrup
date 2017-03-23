'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const child_process = require('child_process');
const util = require('util');

const Log = require('./Log');
const Utils = require('./Utils');

class Scenario {
    constructor(data) {
        this._log = new Log({ scenario: data.name });
        this._utils = new Utils;

        if (
            !data.name ||
            !data.entrypoint
        ) {
            throw new ScenarioInputInvalid(scenarioInputOptions);
        }

        let defaultData = {
            dependsOn: [],
            worker: 'Console',
            finished: false,
            report: null,
            data: {},
            config: {},
            debug: false
        };

        this._data = _.extend(defaultData, data);
        if (data.config && data.config.Test) {
            this._data.data.Test = data.config.Test;
        }
    }
    get name() {
        return this._data.name;
    }
    get dependsOn() {
        return this._data.dependsOn;
    }
    get data() {
        return this._data.data;
    }
    get report() {
        return this._data.report;
    }
    updateData(data) {
        this._data.data = this._utils.deepExtend(this._data.data, data);
    }
    run(done) {
        let worker = child_process.fork(`${__dirname}/../Worker`);
        let localData = {};
        let log = new Log({
            scenario: this.name,
            worker: `${this._data.worker}Worker#${worker.pid}`
        });

        if (this._data.debug) {
            log.control(`starting`);
        }

        worker.on('message', (msg) => {
            if (msg.output) {
                try {
                    this._data.report = JSON.parse(msg.output);
                } catch (error) {
                    this._data.report = msg.output;
                }
                if (this._data.debug) {
                    log.report('mocha', this._data.report);
                }
            }

            if (msg.save) {
                if (this._data.debug) {
                    log.log(`\b${chalk.magenta('[data]')} ${JSON.stringify(msg.save)}`);
                }
                _.set(localData, msg.save.path, msg.save.data);
            }

            if (msg.log) {
                if (this._data.debug) {
                    log.log(`${msg.log}`);
                }
            }

            if (msg.control) {
                if (this._data.debug) {
                    log.control(`${msg.control}`);
                }
            }

            if (msg.mochaUpdate) {
                if (this._data.debug) {
                    log.update('mocha', msg.mochaUpdate);
                }
            }

            if (msg.repl) {
                console.log(msg.repl);
            }

            if (msg.exit) {
                this._data.finished = true;
                worker.kill();
            }
        });

        worker.on('exit', () => {
            this._data.finished = true;
            this.updateData(localData);
            done(null, this);
        });

        worker.send({ scenario: this._data });
    }
}

module.exports = Scenario;
