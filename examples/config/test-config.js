var assert = require('assert');
describe('Global', function() {
    describe('#Get()', function() {
        it('should find data in the parent process from configuration file', function () {
            assert(Get('Test.Preset') == 'some data');
        });
    });
});
