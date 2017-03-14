'use strict';

const util = require('util');
const _ = require('lodash');
const chalk = require('chalk');

const Queue = require('./Libs/Queue');
const Config = require('./Libs/Config');

class Syrup {
    constructor() {
        this._queue = new Queue;
        this._config = new Config;
        this._debugging = false;
    }
    enableDebug() {
        this._debugging = true;

        return this;
    }
    config(path) {
        this._config.load(path);

        return this;
    }
    scenario(name, entrypoint, dependsOn, worker) {
        let scenarioOptions = {
            name: name,
            entrypoint: entrypoint,
            dependsOn: dependsOn ? dependsOn : [],
            worker: worker != undefined ? worker : 'Console',
            config: this._config.data,
            debug: this._debugging
        };

        this._queue.add(scenarioOptions);

        return this;
    }
    pour(donePouring, pourProgressUpdate) {
        if (typeof donePouring != 'function') {
            donePouring = (error, results) => {};
            this._debugging = true;
        }
        if (typeof pourProgressUpdate != 'function') {
            pourProgressUpdate = (error, progress) => {};
        }

        this._queue.initialise(function (error, prorgess) {
            pourProgressUpdate(error, prorgess);
        });
        if (this._debugging) {
            console.log(`${chalk.green('[syrup]')} Run grouping: ${JSON.stringify(this._queue._runOrder)}`);
            console.log(`${chalk.green('[syrup]')} Test Configuration: ${JSON.stringify(this._config.data)}`);
        }
        this._queue.run((error, results) => {
            if (error) {
                console.log(`${chalk.red('[syrup] [error]')} Tests finished with error: ${error} and results: ${JSON.stringify(results)}`);
            }
            if (this._debugging) {
                console.log(`${chalk.green('[syrup] [results]')} ${JSON.stringify(results)}`);
            }
            donePouring(error, results);
        });
    }
}

module.exports = Syrup;
