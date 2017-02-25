const syrup = require('../../');

syrup.config(`./config.yaml`);

syrup.scenario('example.org - 1', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 2', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 3', `${__dirname}/test-example.org`, ['example.org - 2'], 'IEBrowser');
syrup.scenario('example.org - 4', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 5', `${__dirname}/test-example.org`, ['example.org - 4'], 'ChromeBrowser');
syrup.scenario('example.org - 6', `${__dirname}/test-example.org`, ['example.org - 1'], 'ChromeBrowser');
syrup.scenario('example.org - 7', `${__dirname}/test-example.org`, ['example.org - 6'], 'ChromeBrowser');
syrup.scenario('example.org - 8', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 9', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 10', `${__dirname}/test-example.org`, ['example.org - 8'], 'IEBrowser');
syrup.scenario('example.org - 11', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 12', `${__dirname}/test-example.org`, [], 'IEBrowser');
syrup.scenario('example.org - 13', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 14', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 15', `${__dirname}/test-example.org`, [], 'ChromeBrowser');
syrup.scenario('example.org - 16', `${__dirname}/test-example.org`, [], 'ChromeBrowser');

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
