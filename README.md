# syrup
Extended mocha testing, with file based snippets, test parallelism, and test dependency.

## tl;dr

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

**documentation status**

- [X] tl; dr
- [X] workers
- [X] globals
- [ ] scenario dependencies
- [ ] low level on how tests are spun up

## what does syrup do?

Syrup allows you to manage mocha tests. Scenarios (mocha tests) are registered before being put into a run order 
according to their dependencies, then run by a worker process. Scenarios that can successfully run at the 
same time will do so. 

## key concepts

**workers** - child processes that run the test scenarios after spinning up any required services

**globals** - globally available methods that give you access to spun up instances of selenium, phatomjs, and others.

**dependants** - when syrup starts a test run it will organise the scenarios into run groups, this ensures that 
scenarios depending on data from another scenario will always run after the scenarios it relies.

### workers

#### what is a worker?

A worker is a child process run by syrup to run a registered scenario. It will typically bootstrap some 
functionality into the mocha test such as a webdriver browser object, some globally accessible functions,
and a messaging system to send data back to the main syrup process.

#### available workers

##### ConsoleWorker

The console worker is the default worker, it provides the basic set of globals and some essential bootstrapping for
running mocha tests.

##### BrowserWorker

There are a number of workers that provide browser based testing capabilities, they are:

**PhantomJSBrowserWorker** Spins up an instance of PhatonJS, with a webdriverio client connected.

**ChromeBrowserWorker** Connects a webdriverio client to a given selenium server with the requirement that tests be run in Chrome.

**FirefoxBrowserWorker** Connects a webdriverio client to a given selenium server with the requirement that tests be run in Firefox.

**IEBrowserWorker** Connects a webdriverio client to a given selenium server with the requirement that tests be run in Internet Explorer.

These workers all provide the same Browser global but set up in different ways. You can use it in your tests like this:

```javascript
it('should navigate to example.com', () =>
    Browser.url('http://example.com')
);
it('should find a heading containing "Example Domain"', () =>
    Browser.getText('h1')
        .then((text) => assert(text === 'Example Domain'))
);
```

### globals

#### what is a global

Globals in the context of syrup are globally defined variables inside the child processes that are spun up to run your
registered scenarios. They provide access to a few basic functions to assist with testing.

#### available globals

**Save(path, data)** saves data to a path (dotted object notation) for retrieval by subsequent tests and scenarios

```javascript
Save('user.email', 'user@example.com');
```

**Get(path)** retrieves data previously saved to a path

```javascript
Get('user.email'); // 'user@example.com
```

**Api** a method to run post and get requests against a HTTP api

```javascript
Api.get('https://api.github.com/users/thejsninja').then((data) => {
    assert(data.login === 'thejsninja');
}));
```

**Runs(path)** includes a 'snippet' (mocha test in an individual file) and runs the mocha test inside

```javascript
describe('Visiting example.com', () => {
    Runs('./examples/snippets/domain/visit_domain');
    Runs('./examples/snippets/domain/assert_heading');
});
```

**Log(message)** logs a message to the debug console

```javascript
Log('Username: ' + Get('user.email')) // [log] Username: user@example.com
```

**Faker** creates fake data for use in tests, provides access to the javascript library [Faker](https://github.com/marak/Faker.js/)

```javascript
Log("Username: " + Faker.make('internet.email')); // [log] Username: ar94nv84atvc43@example.com
```

**Scenario** syrup makes an object representing the current scenario, including it's configuration and the scenarios it relies on.

```json
{
  "dependsOn": [],
  "worker":"Console",
  "finished":false,
  "report":null,
  "data":{},
  "config":{},
  "debug":true,
  "globals":false,
  "name":"githubApi",
  "entrypoint":"/home/.../code/syrup/examples/api/github-api"
}
```

#### registering your own globals

You can register your own globally accessible methods (overwriting any that already exist) by creating
a globals file and registering it within the syrup object.

```javascript
// globals.js
module.exports = {
    Assert: require('assert'),
};
```

```javascript
// start.js - syrup executable file
syrup
    .registerGlobals(`${__dirname}/globals.js`)
    .scenario({
        name: 'array',
        entrypoint: `${__dirname}/test-array`
    })
    .pour();
```

This would make the Assert method available inside all of your tests.