const syrup = require('../../');

syrup.scenario('array', `${__dirname}/test-array`);
syrup.scenario('object', `${__dirname}/test-object`);
syrup.scenario('save', `${__dirname}/test-save`);
syrup.scenario('get', `${__dirname}/test-get`, ['save']);

syrup.pour(function (error, results) {
    console.log(JSON.stringify(results));
}, function (error, results) {
    // Do something with the progress update
    // Results Example:
    //
    //      {
    //          array: 'done',
    //          object: 'done',
    //          save: 'done',
    //          get: 'pending'
    //      }
});