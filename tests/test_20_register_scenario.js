require('./bootstrap');

describe('Registering a scenario with the syrup object', function () {
    it('should call scenario(`name`, { })', function () {
        let syrup = new Syrup;
        syrup.scenario(`name`, { });
    });
    it('should throw a ScenarioAlreadyRegisteredError when registering a scenario that already exists', function (done) {
        let syrup = new Syrup;
        syrup.scenario('test', { entrypoint: `` });
        try {
            syrup.scenario('test', { entrypoint: `` });
            done('did not throw an Error');
        } catch (err) {
            if (err.constructor.name === 'ScenarioAlreadyRegisteredError') {
                done();
            } else {
                done('did not throw ScenarioAlreadyRegisteredError')
            }
        }
    })
});