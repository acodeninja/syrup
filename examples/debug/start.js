require('../../')
    .scenario({
        name: 'example.com',
        entrypoint: `${__dirname}/test-example.com`,
        worker: 'PhantomJsBrowser'
    })
    .pour();
