var assert = require('assert');
describe('Example.com', function() {
    describe('page content', function() {
        it('should navigate to example.org', () =>
            Browser.url('http://example.org')
        );
        it('should find a heading containing "Example Domain"', (done) => {
            Browser.getText('h1')
                .then((text) => assert(text == 'Example Domain'))
                .then(done);
        );
    });
});
