var assert = require('assert');
describe('Global', function() {
    describe('#Get()', function() {
        it('should find data in the parent process', function () {
            assert(Get('check.test') == 'some data');
        });
    });
});
