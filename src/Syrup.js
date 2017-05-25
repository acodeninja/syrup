'use strict';

const util = require('util');
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const yargs = require('yargs').argv;

const Config = require('./Libs/Config');
const Log = require('./Libs/Log');
const Queue = require('./Libs/Queue');
const Utils = require('./Libs/Utils');

class Syrup {
    constructor() {
        this._config = new Config;
        this._debugging = !!(yargs.debug);
        this._globalsFile = false;
        this._logFile = (yargs.output) ? require('path').resolve(yargs.output) : false;
        this._progressFile = (yargs.progress) ? require('path').resolve(yargs.progress) : false;
        this._log = new Log;
        this._queue = new Queue;
        this._utils = new Utils;
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

        this._queue.add(
            this._utils.deepExtend(
                scenarioOptions,
                _.pick(
                    scenarioInputOptions,
                    [
                        'name',
                        'entrypoint',
                        'dependsOn',
                        'notes',
                        'worker'
                    ]
                )
            )
        );

        return this;
    }
    pour(donePouring, pourProgressUpdate) {
        if (typeof donePouring !== 'function') {
            donePouring = (error, results) => {};
        }
        if (typeof pourProgressUpdate !== 'function') {
            pourProgressUpdate = (error, progress) => {};
        }

        this._queue.initialise((error, progress) => {
            if (this._progressFile) {
                fs.writeFileSync(this._progressFile, JSON.stringify(progress), 'utf8');
            }
            pourProgressUpdate(error, progress);
        });

        if (this._debugging) {
            this._log.log(`\b${chalk.magenta('[runs]')} ${JSON.stringify(this._queue._runOrder)}`);
            this._log.log(`\b${chalk.magenta('[config]')} ${JSON.stringify(this._config.data)}`);
        }
        this._queue.run((error, results) => {
            if (error) {
                this._log.log(`Tests finished with error: ${error} and results: ${JSON.stringify(results)}`);
            }
            if (this._debugging) {
                this._log.results(JSON.stringify(results));
            }
            if (this._logFile) {
                fs.writeFileSync(this._logFile, JSON.stringify(results), 'utf8');
            }
            donePouring(error, results);
        });
    }
}

module.exports = Syrup;
