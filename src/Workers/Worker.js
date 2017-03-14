'use strict';

const _ = require('lodash');
const chalk = require('chalk');

const Faker = require('../Libs/Faker');
const Mocha = require('mocha');
const Log = require('../Libs/Log');

class Worker {
    constructor(scenario) {
        this.scenario = scenario;
        this.mocha = new Mocha();
        this.mocha.addFile(scenario.entrypoint);
        this.mocha.reporter('json');
        this.mocha.timeout(0);
        this.data = scenario.data;
        this.setGlobals();
    }
    setup(done) {
        done();
    }
    circularJsonParser(o) {
        var cache = [];
        var output = '';

        output = JSON.stringify(o, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        });

        cache = null;
        return output;
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
            process.send({ mochaUpdate: { type: 'start', output: this.circularJsonParser(test) } });
        });
        runner.on('test end', (test) => {
            process.send({ mochaUpdate: { type: 'end', output: this.circularJsonParser(test) } });
        });
        runner.on('pass', (test) => {
            process.send({ mochaUpdate: { type: 'pass', output: this.circularJsonParser(test) } });
        });
        runner.on('fail', (test) => {
            process.send({ mochaUpdate: { type: 'fail', output: this.circularJsonParser(test) } });
        });
    }
    teardown(done) {
        done();
    }
    setGlobals() {
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

        global.Log = (message) => {
            process.send({ log: `\b${chalk.magenta('[log]')} ${message}` });
        }

        if (this.scenario.globals) {
            try {
                _.each(require(this.scenario.globals), (globalsModule, moduleName) => {
                    global[moduleName] = globalsModule;
                    process.send({ log: `Adding module ${moduleName} to global` });
                });
            } catch (err) {

            }
        }
    }
}

module.exports = Worker;
