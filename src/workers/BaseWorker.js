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
        this._globals = _.uniq([
            'assert',
            'get',
            'runs',
            { name: 'config', options: this.scenario.config },
            { name: 'save', options: this.scenario.data }
        ].concat(this.scenario.options.requires));
    }
    setup(done) {
        let that = this;

        EventsBus.listen('data:save', (payload) => {
            this.scenario.data = Util.deepExtend(this.scenario.data, _.set({}, payload.path, payload.data));
        });

        try {
            async.filter(this._globals, function(requirement, callback) {
                let theGlobal = `${__dirname}/../globals/` + (typeof requirement === 'string' ? requirement : requirement.name);
                let options = typeof requirement === 'object' ? requirement.options : {};

                requirement = require(theGlobal);

                if (typeof requirement === 'function') {
                    requirement(callback, options);
                } else {
                    requirement.up(callback, options);
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
    done(done) {
        try {
            async.filter(this._globals, function(requirement, callback) {
                let theGlobal = `${__dirname}/../globals/` + (typeof requirement === 'string' ? requirement : requirement.name);
                let options = typeof requirement === 'object' ? requirement.options : {};

                requirement = require(theGlobal);

                if (typeof requirement === 'object' && _.has(requirement, 'down')) {
                    requirement.down(callback, options);
                } else {
                    callback();
                }
            }, function (err) {
                done(err);
            });
        } catch (err) {
            throw new RequirementDoesNotExistError(err.toString().replace(/^([\s\S]+(globals\/))/, '').replace("\'", ''));
        }
    }
}

module.exports = BaseWorker;