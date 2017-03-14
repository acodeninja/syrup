const syrup = require('../../');

syrup.enableDebug()
    .config(`${__dirname}/config.yaml`)
    .scenario({
        name: 'example.org - 1',
        entrypoint: `${__dirname}/test-example.org`,
        dependsOn: [],
        worker: 'ChromeBrowser'
    })
    .scenario({
        name: 'example.org - 2',
        entrypoint: `${__dirname}/test-example.org`,
        dependsOn: [],
        worker: 'ChromeBrowser'
    })
    .pour();
