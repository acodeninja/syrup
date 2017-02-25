'use strict';

const Queue = require('./Libs/Queue');
const Config = require('./Libs/Config');

class Syrup {
    constructor() {
        this._queue = new Queue;
        this._config = new Config;
    }
    config(path) {
        this._config.load(path);
    }
    scenario(name, entrypoint, dependsOn, worker) {
        let scenarioOptions = {
            name: name,
            entrypoint: entrypoint,
            dependsOn: dependsOn ? dependsOn : [],
            worker: worker != undefined ? worker : 'Console',
            config: this._config.data
        };

        this._queue.add(scenarioOptions);
    }
    pour(donePouring, pourProgressUpdate) {
        this._queue.initialise(function (error, prorgess) {
            pourProgressUpdate(error, prorgess);
        });
        this._queue.run(function (error, results) {
            donePouring(error, results);
        });
    }
}

module.exports = Syrup;
