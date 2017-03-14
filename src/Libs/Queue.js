'use strict';

const _ = require('lodash');
const async = require('async');

const Scenario = require('./Scenario');

// Errors
const ScenarioExistsError =
    require('../Errors/ScenarioExistsError');
const ScenarioTypeError =
    require('../Errors/ScenarioTypeError');
const ScenarioNotRegisteredError =
    require('../Errors/ScenarioNotRegisteredError');
const QueueFrozenError =
    require('../Errors/QueueFrozenError');

class Queue {
    constructor() {
        this._scenarios = {};
        this._runOrder = [];
        this._frozen = false;
        this._data = {};
        this._jobs = [];
        this._reports = {};
    }
    add(scenario) {
        if (this._frozen) {
            throw new QueueFrozenError;
        }
        if (_.keys(this._scenarios).indexOf(scenario.name) != -1) {
            throw new ScenarioExistsError;
        }

        this._scenarios[scenario.name] = new Scenario(scenario);
    }
    setData(data) {
        _.extend(this._data, data);
    }
    initialise(progressUpdate) {
        this.buildRunOrder();
        this.buildJobs(progressUpdate);
    }
    buildRunOrder() {
        _.each(this._scenarios, (scenario, name) => {
            let scenarioPosition = 0;

            if (scenario.dependsOn.length != 0) {
                _.each(scenario.dependsOn, (depends) => {
                    _.each(this._runOrder, (tasks, position) => {
                        if (
                            tasks.indexOf(depends) != -1
                        ) {
                            scenarioPosition = position + 1;
                        }
                    });
                });
            }

            if (this._runOrder[scenarioPosition] == undefined) {
                this._runOrder[scenarioPosition] = [];
            }

            this._runOrder[scenarioPosition].push(scenario.name);
        });
    }
    buildJobs(progressUpdate) {
        _.each(this._runOrder, (tasks, key) => {
            let job = [];

            _.each(tasks, (task) => {
                let scenario = this._scenarios[task];
                job.push(scenario.run.bind(scenario));
            });

            job.push((done) => {
                let scenarioStatus = {};
                _.each(this._scenarios, function (scenario) {
                    scenarioStatus[scenario.name] = scenario._data.finished ?
                        'done' : 'pending';
                })
                progressUpdate(null, scenarioStatus);
                done();
            })

            this._jobs.push((done) => {
                async.parallel(job, (error, scenarios) => {
                    _.each(scenarios, (scenario) => {
                        if (scenario !=undefined && scenario.constructor.name == 'Scenario') {
                            _.extend(this._data, scenario.data);
                        }
                    });
                    _.each(this._scenarios, (scenario) => {
                        scenario.updateData(this._data);
                    });
                    done(error);
                });
            });
        });
    }
    run(done) {
        async.series(this._jobs, () => {
            done(null, this.report);
        });
    }
    get report() {
        _.each(this._scenarios, (scenario) => {
            this._reports[scenario.name] = scenario._data;
        })
        return this._reports;
    }
    getScenario(name) {
        return this._scenarios[name];
    }
}

module.exports = Queue;
