describe('Syrup Instantiation', function() {
    it('should instantiate without throwing an error', function() {
        require('../index.js');
    });
    it('should instantiate with a faker object as a property', function() {
        let assert = require('assert');
        assert(typeof require('../index.js').faker == 'object');
    });
});
