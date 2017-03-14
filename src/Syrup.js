'use strict';

const util = require('util');
const _ = require('lodash');
const chalk = require('chalk');

const Queue = require('./Libs/Queue');
const Config = require('./Libs/Config');
const Utils = require('./Libs/Utils');

class Syrup {
    constructor() {
        this._queue = new Queue;
        this._config = new Config;
        this._utils = new Utils;
        this._debugging = false;
        this._globalsFile = false;
    }
    enableDebug() {
        this._debugging = true;

        return this;
    }
    registerGlobals(path) {
        this._globalsFile = require('path').resolve(path);

        return this;
    }
    config(path) {
        this._config.load(path);

        return this;
    }
    scenario(scenarioInputOptions) {
        let scenarioOptions = {
            dependsOn: [],
            worker: 'Console',
            config: this._config.data,
            debug: this._debugging,
            globals: this._globalsFile,
        };

        this._queue.add(this._utils.deepExtend(scenarioOptions, scenarioInputOptions));

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
