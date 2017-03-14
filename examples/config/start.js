const syrup = require('../../');

syrup.enableDebug()
    .config(`${__dirname}/config.yaml`)
    .scenario({
        name: 'GetConfigData',
        entrypoint: `${__dirname}/test-config`
    })
    .pour();
