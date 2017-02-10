'use strict';

const Faker = require('./Libs/Faker');

class Syrup {
    constructor() {
        this.faker = new Faker;
    }
}

module.exports = new Syrup();
