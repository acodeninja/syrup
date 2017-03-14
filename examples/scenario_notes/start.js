const syrup = require('../../');

syrup.enableDebug()
    .scenario({
        name: 'array',
        notes: 'Test that standard array methods work',
        entrypoint: `${__dirname}/test-array`,
    })
    .pour();
