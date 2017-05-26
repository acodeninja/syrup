require('../../')
    .config(`${__dirname}/config.yaml`)
    .scenario({
        name: 'GetConfigData',
        entrypoint: `${__dirname}/test-config`
    })
    .pour();
