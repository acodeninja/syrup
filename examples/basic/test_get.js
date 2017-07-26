describe('Retrieving data', function() {
    it('should retrieve some test data from the main process', () => {
        Assert(Get('data.test') === 'testing');
    });
    it('should retrieve some test data from the main process given via a config file', () => {
        Assert(Conf('Test.Data') === 'testing');
    });
});