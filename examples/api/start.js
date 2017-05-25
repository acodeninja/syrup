const syrup = require('../../');

syrup
    .scenario({
        name: 'example.com',
        entrypoint: `${__dirname}/github-api`,
        worker: 'PhantomJsBrowser'
    })
    .pour();
