describe('Syrup Faker', function() {
    it('should instantiate with a faker object as a property', function() {
        const assert = require('assert');
        assert(typeof require('../index.js').faker == 'object');
    });
    it('should generate fake data when given a faker template', function () {
        const syrup = require('../');
        const assert = require('assert');

        let fakeData = syrup.faker.make('company.bsBuzz');

        assert(fakeData !== 'company.bsBuzz');
    });
});
