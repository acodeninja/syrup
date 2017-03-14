const syrup = require('../../');

syrup.enableDebug()
    .scenario('array', `${__dirname}/test-array`)
    .scenario('object', `${__dirname}/test-object`)
    .scenario('save', `${__dirname}/test-save`)
    .scenario('get', `${__dirname}/test-get`, ['save'])
    .pour();
