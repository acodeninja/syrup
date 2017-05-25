const syrup = require('../../');

syrup
    .scenario({
        name: 'githubApi',
        entrypoint: `${__dirname}/github-api`
    })
    .pour();
