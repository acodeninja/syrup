'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

const ConfigNotFoundError = require('../Errors/ConfigNotFoundError');

class Config {
    constructor() {
        this._data = {};
    }
    get data() {
        return this._data;
    }
    load(path) {
        try {
            this._data = yaml.safeLoad(fs.readFileSync(
                require('path').resolve(path),
                'utf8'
            ));

            return true;
        } catch (e) {
            throw new ConfigNotFoundError(path);
        }
    }
}

module.exports = Config;
