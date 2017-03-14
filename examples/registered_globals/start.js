const syrup = require('../../');

syrup.enableDebug()
    .registerGlobals(`${__dirname}/globals.js`)
    .scenario('array', `${__dirname}/test-array`)
    .scenario('object', `${__dirname}/test-object`)
    .pour();
