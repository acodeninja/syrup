describe('Saving data', function() {
    it('should save some test data to the scenario', () => {
        Save('data.test', 'testing');
    });
    it('should retrieve some test data from the main process', () => {
        Assert(Get('data.test') === 'testing');
    });
});