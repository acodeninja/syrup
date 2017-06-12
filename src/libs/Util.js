'use strict';

class Util {
    static circularStringify(o, strip = false) {
        var cache = [];
        var output = '';

        output = JSON.stringify(o, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (strip && key.indexOf('_') === 0) {
                    return;
                }
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        });

        cache = null;
        return output;
    }
    static deepExtend(target, source) {
        for (var prop in source) {
            if (
                prop in target &&
                typeof(target[prop]) == 'object' &&
                typeof(source[prop]) == 'object'
            ) {
                this.deepExtend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }

        return target;
    }
}

module.exports = Util;
