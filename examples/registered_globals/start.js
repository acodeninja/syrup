const syrup = require('../../');

syrup.enableDebug()
    .registerGlobals(`${__dirname}/globals.js`)
    .scenario({
        name: 'array',
        entrypoint: `${__dirname}/test-array`
    })
    .scenario({
        name: 'object',
        entrypoint: `${__dirname}/test-object`
    })
    .pour();
