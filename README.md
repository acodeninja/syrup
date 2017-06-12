# syrup

[![Build Status](https://travis-ci.org/thejsninja/syrup.svg)](https://travis-ci.org/thejsninja/syrup)

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
