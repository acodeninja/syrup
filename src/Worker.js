'use strict';
process.on('message', (message) => {
    let worker = false;
    let data = {};

    if (message.scenario && !worker) {
        let scenario = message.scenario;
        // console.log(`${scenario.worker}Worker#${process.pid} has received scenario '${scenario.name}'`);

        const Worker = require(`./Workers/${message.scenario.worker}Worker`);

        worker = new Worker(message.scenario);

        worker.setup(() =>
            worker.run(() =>
                worker.teardown(() =>
                    process.send({ teardown: true })
                )
            )
        );
    }
});
