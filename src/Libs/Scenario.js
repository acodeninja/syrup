'use strict';

const _ = require('lodash');
const child_process = require('child_process');

class Scenario {
    constructor(data) {
        let defaultData = {
            dependsOn: [],
            worker: 'Console',
            finished: false,
            report: null,
            data: {}
        };
        this._data = _.extend(defaultData, data);
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
