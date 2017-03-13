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
        this._queue.initialise(function (error, prorgess) {
            pourProgressUpdate(error, prorgess);
        });
        if (this._debugging) {
            console.log(`${chalk.green('[syrup]')} Starting syrup with the following set up:`);

            console.log(`${chalk.green('[syrup]')} Run order:`)
            _.each(this._queue._runOrder, (jobs, order) => {
                console.log(`${chalk.green('[syrup]')} Run ${order+1}: ${jobs.join(', ')}`);
            });

            console.log(`${chalk.green('[syrup]')} Test Configuration: ${JSON.stringify(this._config.data)}`);
        }
        this._queue.run(function (error, results) {
            donePouring(error, results);
        });
    }
}

module.exports = Syrup;
