var assert = require('assert');
describe('Object', function() {
    describe('#hasOwnProperty()', function() {
        it('should return true when the object property is present', function() {
            let object = { test: 'test' };
            assert(object.hasOwnProperty('test'));
        });
    });
});
