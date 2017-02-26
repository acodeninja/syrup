const assert = require('assert');

module.exports = () => it('should find a heading containing "Example Domain"', () =>
    Browser.getText('h1')
        .then((text) => assert(text == 'Example Domain'))
);
