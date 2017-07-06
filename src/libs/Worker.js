'use strict';

const _ = require('lodash');
const fork = require('child_process').fork;

const EventsBus = require('./EventsBus');
const Util = require('./Util');

class Worker {
    constructor(scenario) {
        this.name = scenario.name;
        this.options = Util.deepExtend({ worker: 'mocha' }, scenario.options);
        this.data = Util.deepExtend(scenario.data, {});
        this.config = Util.deepExtend(scenario.config, {});
    }
    start(data) {
        let worker = fork(`${__dirname}/../Worker`);

        worker.on('message', (message) => {
            if (_.has(message, 'event') && _.has(message, 'data')) {
                EventsBus.emit(message.event, message.data);
            }
        });

        worker.on('exit', () => {

        });

        worker.send({ scenario: this });
    }
}

module.exports = Worker;