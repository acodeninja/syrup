require('./bootstrap');

describe('Registering globals with the syrup object', function () {
    let syrup = new Syrup;

    it('should call globals(`path`)', function () {
        syrup.globals(`${__dirname}/globals`);
    });
});