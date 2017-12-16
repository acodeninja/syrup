# syrup

[![Build Status](https://travis-ci.org/acodeninja/syrup.svg)](https://travis-ci.org/acodeninja/syrup)

## tl;dw

Write a test
```javascript
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            Assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
```

Setup and register a scenario for your test
```javascript
require('syrup').debug().scenario(
    'example:arrays',
    {
        entrypoint: `${__dirname}/test_array.js`
    }
);
```

Run the scenario
```bash
$ node start.js
[syrup:started] {"scenarios":["example:arrays"],"config":{}}
[example:arrays][scenario:started]
[example:arrays][worker:started]
[example:arrays][mocha:test] should return -1 when the value is not present
[example:arrays][mocha:pass] should return -1 when the value is not present
[example:arrays][worker:finished]
[example:arrays][scenario:finished]
[syrup:finished]
$ _
```

## Examples

You will find a full set of examples in the ```./examples``` folder. The basic example
folder has a fully bootstrapped setup for use on the command line. Feel free to copy
this set up for your own projects.

You can run the test setup like this:

```bash
$ node examples/basic/start.js --progress --report --debug --config ./examples/basic/config.yaml
```

This will output debug information, progress updates and the final report for you run.
In addition it will load the config.yaml file for use in your scenarios and for the
globals inside each worker.
