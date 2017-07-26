'use strict';

const _ = require('lodash');

const EventsBus = require('../libs/EventsBus');

module.exports = (done) => {
    global.Get = (path) => {
        let data = _.get(global.Data, path);
        EventsBus.emit('data:get', { path: path, data: data });
        return data;
    };
    done();
};
