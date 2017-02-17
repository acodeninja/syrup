'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

class Config {
    constructor() {

    }
    getLocalConfig(directory) {
        try {
            return yaml.safeLoad(fs.readFileSync(
                require('path').resolve(directory, 'config.yaml'),
                'utf8'
            ))
        } catch (e) {
            return e;
        }
    }
}

module.exports = Config;
