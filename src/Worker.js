'use strict';

const _  = require('lodash');

const EventsBus = require('./libs/EventsBus');
const Util = require('./libs/Util');

const workers = {
    'mocha': 'MochaWorker'
};

EventsBus.listen('**', function (data) {
    process.send({
        event: this.event,
        data: data
    });
});

process.on('message', (message) => {
    if  (_.has(message, 'event') && _.has(message, 'data')) {
        EventsBus.emit(message.event, message.data);
    }
    if (_.has(message, 'scenario')) {
        const Worker = require(`./workers/${workers[message.scenario.options.worker]}`);
        let worker = new Worker(message.scenario);

        try {
            worker.setup(() => {
                worker.run((results) => {
                    worker.report = results;
                    EventsBus.emit(`worker:finished`, JSON.parse(Util.circularStringify(worker, true)));
                    process.exit();
                });
            });
        } catch(err) {
            EventsBus.emit(`worker:error`, { name: worker.name, data: { error: err.toString(), stack: err.stack } });
            process.exit();
        }
    }
});
