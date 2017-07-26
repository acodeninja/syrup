require('./bootstrap');

syrup
    .scenario('example:arrays', { entrypoint: `${__dirname}/test_array.js` })
    .scenario('example:objects', { entrypoint: `${__dirname}/test_object.js` })
    .scenario('example:save', { entrypoint: `${__dirname}/test_save.js` })
    .scenario('example:get', { entrypoint: `${__dirname}/test_get.js`, after: ['example:save'] })
    .scenario('example:browser', { entrypoint: `${__dirname}/test_browser.js`, requires: [{ name: 'browser', options: syrup._config.Browser }] })
    .scenario('example:api', { entrypoint: `${__dirname}/test_api.js`, requires: ['api'] })
    .scenario('example:runs', { entrypoint: `${__dirname}/test_runs.js` })
    .pour();
