const syrup = require('../../');

syrup.config(`${__dirname}/config.yaml`);

syrup.scenario('example.org1', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org2', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org3', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org4', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org5', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org6', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org7', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org8', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org9', `${__dirname}/test-example.org`, [], 'ChromeBrowser');

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
