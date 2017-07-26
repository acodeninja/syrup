'use strict';

const _ = require('lodash');

const EventsBus = require('../libs/EventsBus');
const Util = require('../libs/Util');

global.Data = {};

module.exports = (done, options) => {
    global.Data = Util.deepExtend(Data, options);

    global.Save = (path, data) => {
        EventsBus.emit('data:save', { path: path, data: data });
        global.Data = Util.deepExtend(Data, _.set({}, path, data));
    };
    done();
};
