'use strict';

const _ = require('lodash');
const chalk = require('chalk');

class Log {
    constructor(options) {
        this._prefix = `${chalk.magenta('[syrup]')}`;
        this._options = options;
        this.detectAbilities();
    }
    log(message) {
        console.log(`${this._prefix} ${message}`);
    }
    report(type, report) {
        let localPrefix = `${this._prefix}${chalk.cyan(`[report]`)} `;

        if (type = 'mocha') {
            report = `Tests: ${report.stats.tests} Passed: ${report.stats.passes} Failed: ${report.stats.failures} Incopmlete: ${report.stats.pending} Duration: ${report.stats.duration}ms`;
        }
        console.log(localPrefix + report);
    }
    control(message) {
        let localPrefix = `${this._prefix}${chalk.magenta(`[control]`)} `;
        console.log(localPrefix + message);
    }
    update(type, update) {
        let colours = {
            'start': 'cyan',
            'end': 'cyan',
            'pass': 'green',
            'fail': 'red',
        };
        let localPrefix = `${this._prefix}${chalk[colours[update.type]](`[${update.type}]`)}`;

        console.log(localPrefix + this.getFullMochaTestTitle(JSON.parse(update.output)));
    }
    results(message) {
        console.log(`${this._prefix}${chalk.magenta('[results]')} ${message}`);
    }
    getFullMochaTestTitle(test) {
        let parent = test.parent;
        let fullTitle = test.title;

        while (parent !== undefined) {
            parent = parent.parent;

            if (parent !== undefined) {
                fullTitle = parent.title + ' ' + fullTitle;
            }
        }

        return fullTitle;
    }
    detectAbilities() {
        if (_.has(this, '_options.scenario')) {
            this._prefix += chalk.green(`[${this._options.scenario}]`);
        }

        if (_.has(this, '_options.worker')) {
            this._prefix += chalk.blue(`[${this._options.worker}]`);
        }
    }
}

module.exports = Log;
