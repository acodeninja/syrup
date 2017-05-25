'use strict';

const http = require('http');
const https = require('https');
const _ = require('lodash');
const parse = require('url').parse;
const Promise = require('promise');

class Api {
    constructor() {
        this._headers = { 'User-Agent': 'syrup', 'Accept': 'application/json' };
        this._data = {};
    }
    headers(headers) {
        this._headers = _.extend(this._headers, headers);

        return this;
    }
    data(data) {
        this._data = _.extend(this._data, data);

        return this;
    }
    get(uri) {
        return this._call(uri, 'get');
    }
    post(uri) {
        return this._call(uri, 'post');
    }
    _call(uri, method) {
        let responseData = '';
        let _uri = parse(uri);
        let client = _uri.protocol.replace(':', '');

        try {
            client = require(client);
        } catch (err) {
            throw new Error('The protocol given is not valid: ' + client);
        }

        let options = {
            hostname: _uri.host,
            path: _uri.pathname,
            method: method.toUpperCase(),
            headers: _.extend({}, this._headers, (method === 'post') ? { 'Content-Length': Buffer.byteLength(this._data) } : {})
        };

        return new Promise((fulfill, reject) => {
            let request = client.request(options, (res) => {
                res.setEncoding('UTF-8');
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    try {
                        responseData = JSON.parse(responseData);
                    } catch(err) {}
                    fulfill(responseData);
                });
            });

            request.on('error', (e) => {
                reject(`problem with request: ${e.message}`);
            });

            if (method === 'post') {
                request.write(this._data);
            }

            request.end();
        });
    }
}

module.exports = Api;