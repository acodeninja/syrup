require('../../')
    .scenario({
        name: 'array',
        entrypoint: `${__dirname}/test-array`
    })
    .scenario({
        name: 'object',
        entrypoint: `${__dirname}/test-object`
    })
    .scenario({
        name: 'save',
        entrypoint: `${__dirname}/test-save`
    })
    .scenario({
        name: 'get',
        entrypoint: `${__dirname}/test-get`,
        dependsOn: ['save']
    })
    .pour();
