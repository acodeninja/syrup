require('../../')
    .scenario({
        name: 'githubApi',
        entrypoint: `${__dirname}/github-api`
    })
    .pour();
