'use strict';

const chalk = require('chalk');

process.on('message', (message) => {
    let worker = false;
    let data = {};

    if (message.scenario && !worker) {
        let scenario = message.scenario;
        console.log(`${chalk.green(`[syrup.${scenario.name}]`)} scenario ${scenario.name} received by ${scenario.worker}Worker#${process.pid}`);
        console.log(`${chalk.green(`[syrup.${scenario.name}]`)} ${scenario.worker}Worker#${process.pid} received data for the test: ${JSON.stringify(scenario.data)}`);

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
