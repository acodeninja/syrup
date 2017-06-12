describe('Retrieving data', function() {
    it('should retrieve some test data from the main process', () => {
        Assert(Get('data.test') === 'testing');
    });
});