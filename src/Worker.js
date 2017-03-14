'use strict';

process.on('message', (message) => {
    let worker = false;
    let data = {};

    if (message.scenario && !worker) {
        let scenario = message.scenario;

        const Worker = require(`./Workers/${scenario.worker}Worker`);

        worker = new Worker(scenario);

        worker.setup(() => {
            process.send({ control: `setup done` });
            worker.run((output) => {
                process.send({ control: `scenario finished` });
                process.send({ output: output });
                worker.teardown(() => {
                    process.send({ control: `scenario torn down` });
                    process.send({ exit: true });
                })
            })
        });
    }
});
