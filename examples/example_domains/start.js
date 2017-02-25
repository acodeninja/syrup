const syrup = require('../../');

syrup.config(`./config.yaml`);

syrup.scenario('example.org - 1', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 2', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 3', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 4', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 5', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 6', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 7', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 8', `${__dirname}/test-example.org`, [], 'ChromeBrowser');

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
