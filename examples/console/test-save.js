var assert = require('assert');
describe('Global', function() {
    describe('#Save()', function() {
        it('should store data in the parent process', function () {
            Save('check.test', 'some data');
        });
    });
});
