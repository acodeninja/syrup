'use strict';

const _ = require('lodash');
const chalk = require('chalk');

const Faker = require('../Libs/Faker');
const Mocha = require('mocha');

class Worker {
    constructor(scenario) {
        this.scenario = scenario;
        this.mocha = new Mocha();
        this.mocha.addFile(scenario.entrypoint);
        this.mocha.reporter('json');
        this.mocha.timeout(0);
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

        global.Runs = (path) => {
            var theSnippet = require(process.cwd() + '/' + path);

            if (typeof theSnippet == 'function') {
                theSnippet();
            }

            return theSnippet;
        };
    }
    setup(done) {
        done();
    }
    run(done) {
        let output = '';

        process.stdout.write = (str) => {
            output += str;
        };

        let runner = this.mocha.run((failures) => {
            done(output);
        });

        runner.on('test', (test) => {
            process.send({ log: `Test started: ${test.title}` });
        });
        runner.on('test end', (test) => {
            process.send({ log: `Test finished: ${test.title}` });
        });
        runner.on('pass', (test) => {
            process.send({ log: `Test passed: ${test.title}` });
        });
        runner.on('fail', (test) => {
            process.send({ log: `Test failed: ${test.title}` });
        });
    }
    teardown(done) {
        done();
    }
}

module.exports = Worker;
