var assert = require('assert');
describe('Example.com', function() {
    describe('page content', function() {
        it('should navigate to example.com', (done) => {
            Browser.url('http://example.com')
                .then(done);
        });
        it('should find a heading containing "Example Domain"', (done) => {
            Browser.getText('h1')
                .then((text) => assert(text == 'Example Domain'))
                .then(done);
        });
    });
});
