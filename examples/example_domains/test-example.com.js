var assert = require('assert');
describe('Example.com', function() {
    describe('page content', function() {
        it('should navigate to example.com', () =>
            Browser.url('http://example.com')
        );
        it('should find a heading containing "Example Domain"', () =>
            Browser.getText('h1')
                .then((text) => assert(text == 'Example Domain'))
        );
    });
});
