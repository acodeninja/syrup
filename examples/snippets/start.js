require('../../')
    .config(`${__dirname}/config.yaml`)
    .scenario({
        name: 'snippets - 1',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: [],
        worker: 'PhantomJsBrowser'
    })
    .scenario({
        name: 'snippets - 2',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: [],
        worker: 'PhantomJsBrowser'
    })
    .scenario({
        name: 'snippets - 3',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: ['snippets - 1'],
        worker: 'PhantomJsBrowser'
    })
    .scenario({
        name: 'snippets - 4',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: ['snippets - 2'],
        worker: 'PhantomJsBrowser'
    })
    .pour();
