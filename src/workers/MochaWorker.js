'use strict';

const mocha = require('mocha');

const BaseWorker = require('./BaseWorker');
const EventsBus = require('../libs/EventsBus');
const Util = require('../libs/Util');

class MochaWorker extends BaseWorker {
    constructor(scenario) {
        super(scenario);
        this._mocha = new mocha();
    }
    setup(done) {
        this._mocha.addFile(this.scenario.options.entrypoint);
        this._mocha.reporter('json');
        super.setup(done);
    }
    run(done) {
        super.run(() => {
            let output = '';

            process.stdout.write = (chunk) => {
                output += chunk;
            };

            let runner = this._mocha.run((failures) => {
                this.scenario.data = Util.deepExtend(this.scenario.data, Data);
                done(JSON.parse(output));
            });

            runner.on('test', (test) => {
                EventsBus.emit('worker:test', {
                    name: this.name,
                    data: test.title
                });
            });

            // runner.on('test end', (test) => {
            //     EventsBus.emit('worker:testend', {);
            // });

            runner.on('pass', (test) => {
                EventsBus.emit('worker:pass', {
                    name: this.name,
                    data: test.title
                });
            });
            runner.on('fail', (test) => {
                EventsBus.emit('worker:fail', {
                    name: this.name,
                    data: test.title
                });
            });
        })
    }
}

module.exports = MochaWorker;