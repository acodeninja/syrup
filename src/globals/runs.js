'use strict';

const _ = require('lodash');

const EventsBus = require('../libs/EventsBus');

module.exports = (done) => {
    global.Runs = (path) => {
        path = require('path').resolve(path);
        let theSnippet = require(path);

        if (typeof theSnippet === 'function') {
            theSnippet();
        }

        return theSnippet;
    };
    done();
};
