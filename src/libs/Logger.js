'use strict';

const _ = require('lodash');
const chalk = require('chalk');

const EventsBus = require('./EventsBus');

class Logger {
    constructor(prefix) {
        let onEvent = this.onEvent.bind(this);

        this._prefix = '';

        EventsBus.listen('**', function (data) {
            onEvent(this.event, data);
        });
    }
    onEvent(event, payload) {
        let prefix = this._prefix;
        let output = '';

        // If we get a string through,
        // attempt to parse it to json
        if (typeof payload === 'string') {
            try { payload = JSON.parse(payload) } catch (err) {}
        }

        if (typeof payload.name !== 'undefined') {
            prefix += chalk.green(`[${payload.name}]`)
        }

        if (typeof event !== 'undefined') {
            prefix += chalk.yellow(`[${event}]`);
        }

        if (typeof payload.data === 'string' && event.indexOf('data:') === -1 ) {
            output += payload.data;
        }

        if (event.indexOf(':error') !== -1) {
            output += this.stringify(payload.data);
        }

        if (event.indexOf('data:') === 0) {
            output += this.stringify(payload);
        }

        if (event.indexOf('syrup:started') === 0) {
            output += this.stringify(payload);
        }

        console.log(`${prefix} ${output}`);
    }
    stringify(data) {
        try {
            if (typeof data === 'object') {
                let _data = {};
                _.each(data, (value, key) => {
                    if (key.indexOf('_') !== 0) {
                        _data[key] = value;
                    }
                });

                data = JSON.stringify(_data);
            }
        } catch (err) {

        }

        return (typeof data === 'undefined') ? '' : data;
    }
}

module.exports = Logger;