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
    setLocale(locale) {
        this.faker.locale = locale;
    }
}

module.exports = new Faker();
