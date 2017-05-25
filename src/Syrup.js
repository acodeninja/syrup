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
        this._logFile = (typeof yargs.output === 'string') ?
            require('path').resolve(yargs.output) : !!(yargs.output);
        this._progressFile = (typeof yargs.progress === 'string') ?
            require('path').resolve(yargs.progress) : !!(yargs.progress);
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
                if (typeof this._progressFile === 'string') {
                    fs.writeFileSync(this._progressFile, JSON.stringify(progress), 'utf8');
                } else {
                    console.log(JSON.stringify(progress));
                }
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
                if (typeof this._logFile === 'string') {
                    fs.writeFileSync(this._logFile, JSON.stringify(results), 'utf8');
                } else {
                    console.log(JSON.stringify(results));
                }
            }

            donePouring(error, results);
        });
    }
}

module.exports = Syrup;
