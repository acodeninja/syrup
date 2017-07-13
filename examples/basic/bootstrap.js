global.syrup = require('../../');

const fs = require('fs');
const resolve = require('path').resolve;
const yaml = require('js-yaml');
const yargs = require('yargs').argv;

if (yargs.config) {
    let config = yaml.safeLoad(fs.readFileSync(
        resolve(yargs.config),
        'utf8'
    ));

    syrup.config(config);

    if (syrup._config.Data) {
        syrup.data = syrup._config.Data;
    }
}

if (yargs.globals && typeof yargs.globals === 'string') {
    syrup.globals(yargs.globals);
}

if (yargs.debug) {
    syrup.debug();
}

if (yargs.progress) {
    syrup.progress((progress) => {
        if (typeof yargs.progress === 'string') {
            fs.writeFileSync(yargs.progress, JSON.stringify(progress), 'utf8');
        } else {
            console.log(JSON.stringify(progress));
        }
    });
}

if (yargs.report) {
    syrup.report((report) => {
        if (typeof yargs.report === 'string') {
            fs.writeFileSync(yargs.report, JSON.stringify(report), 'utf8');
        } else {
            console.log(JSON.stringify(report));
        }
    });
}
