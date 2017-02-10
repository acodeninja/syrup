'use strict';
const faker = require('faker');

class Faker {
    constructor() {
        this.faker = faker;
    }
    make(template) {
        let output = this.faker.fake('{{' + template + '}}');

        return output ? output : false;
    }
}

module.exports = new Faker();
