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
