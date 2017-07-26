describe('Running snippets', function() {
    it('should run the save test', () => {
        Runs(`${__dirname}/test_save`);
    });
    it('should run the get test', () => {
        Runs(`${__dirname}/test_get.js`);
    });
});