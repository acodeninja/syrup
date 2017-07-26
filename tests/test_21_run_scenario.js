require('./bootstrap');

describe('Running a scenario registerered with the syrup object', function () {
    it('should see a NoScenariosRegisteredError if pour is called without any registered scenarios', function (done) {
        let syrup = new Syrup;
        try {
            syrup.pour(() => {});
            done('failed to throw an Error');
        } catch (err) {
            if (err.constructor.name === 'NoScenariosRegisteredError') {
                done();
            } else {
                done(err)
            }
        }
    })
    it('should see results when running a scenario', function (done) {
        let syrup = new Syrup;
        syrup.scenario(`name`, { });
        syrup.pour(() => {
            done();
        });
    });
});