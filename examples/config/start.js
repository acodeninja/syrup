const syrup = require('../../');

syrup.enableDebug()
    .config(`${__dirname}/config.yaml`)
    .scenario('GetConfigData', `${__dirname}/test-config`)
    .pour();
