'use strict';
const faker = require('faker');

class Faker {
    constructor() {
        this.faker = faker;
    }
}

module.exports = new Faker();
