'use strict';

const chalk = require('chalk');

process.on('message', (message) => {
    let worker = false;
    let data = {};

    if (message.scenario && !worker) {
        let scenario = message.scenario;

        if (scenario.debug) {
            console.log(`${chalk.blue(`[${scenario.worker}Worker#${process.pid}]`)} scenario ${scenario.name} received with data: ${JSON.stringify(scenario)}`);
        }

        const Worker = require(`./Workers/${scenario.worker}Worker`);

        worker = new Worker(scenario);

        worker.setup(() => {
            console.log(`${chalk.blue(`[${scenario.worker}Worker#${process.pid}]`)} scenario ${scenario.name} has been set up`);
            worker.run(() => {
                console.log(`${chalk.blue(`[${scenario.worker}Worker#${process.pid}]`)} scenario ${scenario.name} has run`);
                worker.teardown(() => {
                    console.log(`${chalk.blue(`[${scenario.worker}Worker#${process.pid}]`)} scenario ${scenario.name} has been torn down`);
                    process.send({ teardown: true })
                })
            })
        });
    }
});
