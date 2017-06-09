'use strict';

const _ = require('lodash');
const parse = require('url').parse;
const querystring = require('querystring');
const Promise = require('promise');

class Api {
    constructor() {
        this._headers = { 'User-Agent': 'syrup', 'Accept': 'application/json' };
        this._dataType = 'json';
        this._acceptedDataTypes = ['json', 'form'];
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
    type(type) {
        if (! this._acceptedDataTypes.includes(type)) {
            throw new Error(`Cannot use type: ${type} please use one of ${this._acceptedDataTypes}`);
        }

        this._dataType = type;

        return this;
    }
    _getData() {
        let data;
        switch (this._dataType) {
            case 'json':
                data = JSON.stringify(this._data);
                break;
            case 'form':
                data = querystring.stringify(this._data);
                this.headers({'Content-Type': 'application/x-www-form-urlencoded'});
                break;
        }

        return data;
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

        let options = {
            hostname: _uri.host,
            path: _uri.pathname,
            port: client === 'http' ? 80 : 443,
            method: method.toUpperCase(),
            headers: _.extend({}, this._headers, (method === 'post') ? { 'Content-Length': Buffer.byteLength(this._getData()) } : {})
        };

        try {
            client = require(client);
        } catch (err) {
            throw new Error('The protocol given is not valid: ' + client);
        }

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
                request.write(this._getData());
            }

            request.end();
        });
    }
}

module.exports = Api;