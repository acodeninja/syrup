# syrup
Extended mocha testing, with file based snippets, test parallelism, and test dependancy.

## TL;DR

```javascript
const syrup = require('syrup');

syrup.scenario(
    // Register a test called array
    'array',
    // Path to a mocha test
    `${__dirname}/tests/array`
);

syrup.scenario(
    // Register a test called object
    'object',
    // Path to a mocha test
    `${__dirname}/tests/object`,
    // This test depends on the array test to complete first
    ['array'],
    // This test runs on the default Consoler Worker
    'Console'
);

syrup.pour((error, results) => {
    // catch end results
}, (error, progress) => {
    // catch prorgess updates
});
```

### What does syrup do?

Syrup allows you to manage mocha tests. Scenarios (mocha tests) are registered
before being put into a run order according to their dependancies, then run by a
worker process. Scenarios that can sucessfully run at the same time will do so.

### What is a worker?

A worker is a forked process run by syrup to process a registered scenario. It will typically bootstrap some functionality into the mocha test such as a webdriver browser object.

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
