'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const util = require('util');
const child_process = require('child_process');

class Scenario {
    constructor(data) {
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
        this._data.data.Test = data.config.Test;
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
        this._data.data = _.extend(this._data.data, data);
    }
    run(done) {
        let worker = child_process.fork(`${__dirname}/../Worker`);
        let localData = {};

        if (this._data.debug) {
            console.log(`${chalk.green(`[syrup.${this.name}]`)} Starting ${this._data.worker}Worker#${worker.pid} for ${this.name}`);
            console.log(`${chalk.green(`[syrup.${this.name}]`)} Sending config: ${JSON.stringify(this._data)}`);
            console.log(`${chalk.green(`[syrup.${this.name}]`)} Sending data: ${JSON.stringify(this.data)}`);
        }

        worker.on('message', (msg) => {
            if (msg.output) {
                try {
                    this._data.report = JSON.parse(msg.output);
                } catch (error) {
                    this._data.report = msg.output;
                }
            }

            if (msg.save) {
                _.set(localData, msg.save.path, msg.save.data);
            }

            if (msg.teardown) {
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
