'use strict';

const _  = require('lodash');
const async = require('async');

const EventsBus = require('../libs/EventsBus');
const Util = require('../libs/Util');

const RequirementDoesNotExistError = require('../errors/RequirementDoesNotExistError');

class BaseWorker {
    constructor(scenario) {
        this.name = scenario.name;
        this.scenario = scenario;
    }
    setup(done) {
        let that = this;
        let globals = _.uniq([
            'assert',
            'get',
            'runs',
            { name: 'config', options: this.scenario.config },
            { name: 'save', options: this.scenario.data }
        ].concat(this.scenario.options.requires));

        EventsBus.listen('data:save', (payload) => {
            this.scenario.data = Util.deepExtend(this.scenario.data, _.set({}, payload.path, payload.data));
        });

        try {
            async.filter(globals, function(requirement, callback) {
                if (typeof requirement === 'string') {
                    require(`${__dirname}/../globals/${requirement}`)(callback);
                }
                if (typeof requirement === 'object') {
                    require(`${__dirname}/../globals/${requirement.name}`)(callback, requirement.options);
                }
            }, function (err, results) {
                if (typeof global.Scenario === 'undefined') {
                    global.Scenario = that.scenario;
                }

                if (typeof global.Config === 'undefined') {
                    global.Config = that.scenario.config;
                }

                // Load in the globals given by the call to syrup.globals();
                if (typeof that.scenario.options.globals === 'string') {
                    let customGlobals = require(that.scenario.options.globals);
                    _.each(customGlobals, (value, key) => {
                        EventsBus.emit('global:loaded', { name: that.scenario.name, data: key });
                        global[key] = value;
                    });
                }
                done(err);
            });
        } catch (err) {
            throw new RequirementDoesNotExistError(err.toString().replace(/^([\s\S]+(globals\/))/, '').replace("\'", ''));
        }
    }
    run(done) {
        EventsBus.emit('worker:started', { name: this.scenario.name });
        done();
    }
}

module.exports = BaseWorker;