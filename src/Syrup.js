'use strict';

// External Libraries
const Mocha = require('mocha');
const _ = require('lodash');
const async = require('async');
const child_process = require('child_process');

// Local Library
const Dependancy = require('./Libs/Dependancy');
const Queue = require('./Libs/Queue');

const ScenarioExistsError =
    require('./Errors/ScenarioExistsError');
const ScenarioNotRegisteredError =
    require('./Errors/ScenarioNotRegisteredError');

class Syrup {
    constructor() {
        this.dependancy = new Dependancy;
        this._queue = new Queue;

        this.scenarios = {};
        this._localData = {};
        this._runOrder = [];
        this._queue = [];
    }
    scenario(name, entrypoint, dependencies, worker = 'Console') {
        if (_.keys(this.scenarios).indexOf(name) != -1) {
            throw new ScenarioExistsError('test');
        }

        let scenario = {
            name: name,
            entrypoint: entrypoint,
            dependencies: dependencies ? dependencies : [],
            worker: worker,
            finished: false,
            report: null,
            data: {}
        };

        this.scenarios[name] = scenario;
    }
    pour(donePouring) {
        this._buildDependancyTree();
        this._buildQueue();

        this._queue.push(() => {
            donePouring(this.scenarios)
        });

        async.series(this._queue);
    }
    _buildDependancyTree() {
        let names = _.keys(this.scenarios);

        _.each(this.scenarios, (scenario) => {
            let lastDependant = 0;
            let positions = [];
            let dependants = {};
            let currentLastDependant = false;

            _.each(scenario.dependencies, (name) => {
                dependants[name] = { found: false, position: false };
            })

            _.each(dependants, (test, name) => {
                let dependantRunPosition = false;

                if (names.indexOf(name) == -1) {
                    throw new ScenarioNotRegisteredError(name);
                }

                _.each(this._runOrder, (tests, key) => {
                    if (tests !== undefined && tests.indexOf(name) != -1) {
                        dependantRunPosition = key;
                    }
                });

                dependants[name].position = dependantRunPosition;
                dependants[name].found = true;
            });

            _.each(dependants, (test, name) => {
                if (! _.has(positions, test.position)) {
                    positions.push(test.position);
                }
            });

            currentLastDependant = positions.sort()[positions.length - 1];
            lastDependant = currentLastDependant ? currentLastDependant : lastDependant;

            if (this._runOrder[lastDependant + 1] == undefined) {
                this._runOrder[lastDependant + 1] = [];
            }

            this._runOrder[lastDependant + 1].push(scenario.name);
        });

        this._runOrder.shift();
    }
    _buildQueue() {
        _.each(this._runOrder, (tests, position) => {
            let myTests = [];
            _.each(tests, (test) => {
                myTests.push(this.scenarios[test]);
            });
            this._queue.push(this._runAsyncMap.apply(this, [myTests]));
        });
    }
    _runAsyncMap(scenarios) {
        let asyncMapMaker = function (done) {
            async.map(
                _.values(scenarios),
                this._runWorker.bind(this),
                (err, results) => {
                    done(err);
                }
            );
        }

        return asyncMapMaker.bind(this);
    }
    _runWorker(scenario, done) {
        scenario.data = this._localData;

        let worker = child_process.fork(`${__dirname}/Worker`);

        worker.on('message', (message) => {
            if (message.output) {
                try {
                    this.scenarios[scenario.name].report = JSON.parse(message.output);
                } catch (error) {
                    this.scenarios[scenario.name].report = message.output;
                }
            }

            if (message.save) {
                this._saveData(scenario, message.save.path, message.save.data);
            }

            if (message.teardown) {
                worker.kill();
            }
        });

        worker.on('exit', () => {
            this.scenarios[scenario.name].finished = true;
            done(null, scenario);
        });

        worker.send({ scenario: scenario });
    }
    _saveData(scenario, path, data) {
        _.set(this.scenarios[scenario.name].data, path, data);
        _.set(this._localData, path, data);
    }
}

module.exports = new Syrup();
