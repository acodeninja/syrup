# syrup
Extended mocha testing, with file based snippets, test parallelism, and test dependancy.

## TL;DR

```javascript
require('syrup')
    .scenario({
        name: 'array',
        // Register a scenario called array

        entrypoint: `${__dirname}/tests/array`
        // Give a path to a mocha test
    })
    .scenario({
        name: 'example.com',
        // Register a scenario called example.com

        entrypoint: `${__dirname}/tests/example.com`,
        // Give a path to a mocha test

        dependsOn: ['array'],
        // Tell syrup this test depends on the array scenario finishing first

        worker: 'PhantomJsBrowser'
        // Specify that we want to run the test inside the PhantomJsBrowser worker
    })
    .pour();
```

```bash
$ node example.js --debug
```

### What does syrup do?

Syrup allows you to manage mocha tests. Scenarios (mocha tests) are registered
before being put into a run order according to their dependancies, then run by a
worker process. Scenarios that can successfully run at the same time will do so.

**Registering a scenario with dependancies**

```javascript
syrup.scenario({
    name: 'object', // Register a scenario called object
    entrypoint: `${__dirname}/tests/object`, // Path to a mocha test
    dependsOn: ['array'], // This test depends on the array scenario to complete first
    worker: 'Console' // This scenario runs on the default Consoler Worker
})
```

#### Scenarios and the Dependancy Tree

Syrup makes use of a dependancy tree to allow for parallelism with tests, this can be leveraged with the third argument of the scenario method, see above for more.

#### What is a worker?

A worker is a forked process run by syrup to process a registered scenario. It will typically bootstrap some functionality into the mocha test such as a webdriver browser object.

#### Options

##### Debugging

Enable debugging to get console logging on internal actions as they take place.

```javascript
syrup.enableDebug();
```

## Available Workers

### ConsoleWorker

All standard mocha methods are available in these tests. In addition, Faker based templating is available, and a data store that is shared between scenarios.

All other workers have this base functionality.

#### Save and Get
```javascript
var assert = require('assert');
describe('Global', function() {
    describe('#Save()', function() {
        it('should store data in the parent process', function () {
            Save('check.test', 'some data');
        });
    });
    describe('#Get()', function() {
        it('should find data in the parent process', function () {
            assert(Get('check.test') == 'some data');
        });
    });
});
```

#### Faker
```javascript
var assert = require('assert');
describe('Global', function() {
    describe('#Faker.make()', function() {
        it('should create a random string from a template', function () {
            assert(Faker.make('company.bs') != 'company.bs');
        });
    });
});
```

### BrowserWorker

The browser worker is a multi browser bootstraper for webdriverio. There are four BrowserWorkers available:

* **PhantomJsBrowser**
* **FirefoxBrowser**
* **ChromerBrowser**
* **IEBrowser**

All BrowserWorkers extend the ConsoleWorker so they have Save, Get, and Faker available to them. Webdriverio provides a Browser global to the scenario while running so navigation actions can be performed.

```javascript
var assert = require('assert');
describe('Example.com', function() {
    describe('page content', function() {
        it('should navigate to example.com', () =>
            Browser.url('http://example.com')
        );
        it('should find a heading containing "Example Domain"', () =>
            Browser.getText('h1')
                .then((text) => assert(text == 'Example Domain'))
        );
    });
});
```
