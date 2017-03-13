'use strict';

const chalk = require('chalk');

process.on('message', (message) => {
    let worker = false;
    let data = {};

    if (message.scenario && !worker) {
        let scenario = message.scenario;

        const Worker = require(`./Workers/${scenario.worker}Worker`);

        worker = new Worker(scenario);

        worker.setup(() => {
            process.send({ log: `scenario ${scenario.name} has been set up` });
            worker.run((output) => {
                process.send({ log: `scenario ${scenario.name} has been run` });
                process.send({ output: output });
                worker.teardown(() => {
                    process.send({ log: `scenario ${scenario.name} has been torn down` });
                    process.send({ exit: true });
                })
            })
        });
    }
});
