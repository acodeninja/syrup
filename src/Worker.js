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

        worker.setup(() =>
            worker.run(() =>
                worker.teardown(() =>
                    process.send({ teardown: true })
                )
            )
        );
    }
});
