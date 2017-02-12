'use strict';

const Faker = require('../Libs/Faker');
const Mocha = require('mocha');
const _ = require('lodash');

class Worker {
    constructor(scenario) {
        this.scenario = scenario;
        this.mocha = new Mocha();
        this.mocha.addFile(scenario.entrypoint);
        this.mocha.reporter('json');
        this.data = scenario.data;

        // Register worker process globals
        global.Faker = new Faker;
        global.Save = (path, data) => {
            _.set(this.data, path, data);

            process.send({
                save: {
                    path: path,
                    data: data
                }
            });
        };

        global.Get = (path) => _.get(this.data, path);
    }
    setup(done) {
        done();
    }
    teardown(done) {
        done();
    }
    run(done) {
        let output = '';

        process.stdout.write = (str) => {
            output += str;
        };

        this.mocha.run((failures) => {
            process.send({ output: output });
            done();
        });
    }
}

module.exports = Worker;
