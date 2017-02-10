'use strict';

const Faker = require('./Libs/Faker');

class Syrup {
    constructor() {
        this.faker = Faker;
    }
}

module.exports = new Syrup();
