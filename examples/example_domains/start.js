const syrup = require('../../');

syrup.enableDebug()
    .config(`${__dirname}/config.yaml`)
    .scenario({
        name: 'example.com',
        entrypoint: `${__dirname}/test-example.com`,
        worker: 'PhantomJsBrowser'
    })
    .scenario({
        name: 'example.org',
        entrypoint: `${__dirname}/test-example.org`,
        worker: 'PhantomJsBrowser'
    })
    .pour();
