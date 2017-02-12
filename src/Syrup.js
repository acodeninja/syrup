'use strict';

const Queue = require('./Libs/Queue');

class Syrup {
    constructor() {
        this._queue = new Queue;
    }
    scenario(name, entrypoint, dependsOn, worker) {
        let scenarioOptions = {
            name: name,
            entrypoint: entrypoint,
            dependsOn: dependsOn ? dependsOn : [],
            worker: worker != undefined ? worker : 'Console'
        }

        this._queue.add(scenarioOptions);
    }
    pour(donePouring) {
        this._queue.initialise();
        this._queue.run(function (error, results) {
            donePouring(error, results);
        });
    }
}

module.exports = new Syrup();
