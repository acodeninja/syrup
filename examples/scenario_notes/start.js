const syrup = require('../../');

syrup.enableDebug()
    .scenario({
        name: 'array',
        notes: 'Test that standard array methods work',
        entrypoint: `${__dirname}/test-array`,
    })
    .scenario({
        name: 'object',
        notes: 'Test that standard object methods work',
        entrypoint: `${__dirname}/test-object`,
    })
    .pour();
