const syrup = require('../../');

syrup.enableDebug()
    .config(`${__dirname}/config.yaml`)
    .scenario({
        name: 'snippets - 1',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: [],
        worker: 'ChromeBrowser'
    })
    .scenario({
        name: 'snippets - 2',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: [],
        worker: 'ChromeBrowser'
    })
    .scenario({
        name: 'snippets - 3',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: [],
        worker: 'ChromeBrowser'
    })
    .scenario({
        name: 'snippets - 4',
        entrypoint: `${__dirname}/test-snippets`,
        dependsOn: [],
        worker: 'ChromeBrowser'
    })
    .pour();
