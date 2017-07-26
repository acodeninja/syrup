'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;

class EventsBus {
    constructor() {
        this.server = new EventEmitter2({
            wildcard: true,
            delimiter: ':',
            newListener: false,
            maxListeners: 100,
            verboseMemoryLeak: false
        });
    }
    emit(event, data) {
        this.server.emit(event, data);
    }
    listen(event, listener) {
        this.server.addListener(event, listener);
    }
}

module.exports = new EventsBus();
module.exports.EventsBus = EventsBus;