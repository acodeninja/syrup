'use strict';

class Utils {
    deepExtend(target, source) {
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

module.exports = Utils;
