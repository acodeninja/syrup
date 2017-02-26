const syrup = require('../../');

syrup.config(`./config.yaml`);

syrup.scenario('snippets - 1', `${__dirname}/test-snippets`, [], 'ChromeBrowser');
syrup.scenario('snippets - 2', `${__dirname}/test-snippets`, [], 'ChromeBrowser');
syrup.scenario('snippets - 3', `${__dirname}/test-snippets`, [], 'ChromeBrowser');
syrup.scenario('snippets - 4', `${__dirname}/test-snippets`, [], 'ChromeBrowser');

syrup.pour(function (error, results) {
    console.log(JSON.stringify(results));
}, function (error, results) {

});
