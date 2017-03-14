'use strict';

const child_process = require('child_process');

const BrowserWorker = require('./BrowserWorker');
const WebDriver = require('webdriverio');

class PhantomJsBrowserWorker extends BrowserWorker {
    constructor(scenario) {
        super(scenario);
    }
    setup(done) {
        var phantomJsPort = Math.floor(Math.random() * (7000 - 6000 + 1)) + 6000;

        this.phantomService = child_process.spawn(
            'phantomjs',
            ['--webdriver', `localhost:${phantomJsPort}`],
            {
                cwd: `${__dirname}/../../node_modules/.bin/`
            }
        );

        this.phantomService.stdout.on('data', (data) => {
            let failedToStart = `${data}`.match(/\[ERROR[\s\S]+(main.fail)/);
            let upAndRunning = `${data}`.match(/running on port ([\d]+)/);

            if(failedToStart) {
                process.send({ log: `PhantomJs failed to start on :${phantomJsPort}` });
                process.send({ exit: true });
            }

            if(upAndRunning) {
                process.send({ log: `PhantomJs started on :${phantomJsPort}` });

                if(typeof global.Browser === 'undefined') {
                    global.Browser = WebDriver.remote({
                        capabilities: { browserName: 'phantomjs' },
                        services: ['phantomjs'],
                        host: `127.0.0.1`,
                        port: `${phantomJsPort}`
                    });
                }

                super.setup(() => {
                    Browser.init().then(() => {
                        process.send({ log: `Browser started on :${phantomJsPort}` });
                        done();
                    }, () => {
                        process.send({ log: `Browser failed to start on :${phantomJsPort}` });
                        process.send({ exit: true });
                    });
                });
            }
        });

        this.phantomService.stderr.on('data', (data) => {
          process.send({ log: `PhantomJs threw an error: ${data}` });
        });

        this.phantomService.on('error', (code) => {
          process.send({ log: `PhantomJs exited with error ${code}` });
        });

        this.phantomService.on('close', (code) => {
          process.send({ log: `PhantomJs exited with code ${code}` });
        });
    }
    teardown(done) {
        super.teardown(() => {
            Browser.end()
                .then(() => {
                    this.phantomService.kill();
                    done();
                }, done)
        });
    }
}

module.exports = PhantomJsBrowserWorker;
