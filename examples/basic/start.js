require('./bootstrap');

syrup
    .scenario(
        'example:arrays',
        {
            entrypoint: `${__dirname}/test_array.js`,
            description: 'Simple javascript Array tests'
        }
    )
    .scenario(
        'example:objects',
        {
            entrypoint: `${__dirname}/test_object.js`,
            description: 'Simple javascript Object tests'
        }
    )
    .scenario(
        'example:save',
        {
            entrypoint: `${__dirname}/test_save.js`,
            description: 'Saving data in the main process'
        }
    )
    .scenario(
        'example:get',
        {
            entrypoint: `${__dirname}/test_get.js`,
            after: ['example:save'],
            description: 'Retreiving data stored in the main process'
        }
    )
    .scenario(
        'example:browser',
        {
            entrypoint: `${__dirname}/test_browser.js`,
            requires: [{ name: 'browser', options: syrup._config.Browser }],
            description: 'Verifying the example.com webpage'
        }
    )
    .scenario(
        'example:api',
        {
            entrypoint: `${__dirname}/test_api.js`,
            requires: ['api'],
            description: 'Testing api connectivity to github.com' }
    )
    .scenario(
        'example:runs',
        {
            entrypoint: `${__dirname}/test_runs.js`,
            description: 'Running test snippets within a syrup scenario'
        }
    )
    .pour();
