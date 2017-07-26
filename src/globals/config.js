'use strict';

const _ = require('lodash');

const EventsBus = require('../libs/EventsBus');
const Util = require('../libs/Util');

global.Config = {};

module.exports = (done, config) => {
    global.Config = Util.deepExtend(global.Config, config);
    global.Conf = (path) => {
        let data = _.get(global.Config, path);
        EventsBus.emit('data:config', { path: path, data: data });
        return data;
    };
    done();
};
