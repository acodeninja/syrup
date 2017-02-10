'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test', () =>
    gulp.src('./tests/test-*', {read: false})
        .pipe(mocha())
);

gulp.task('watch', () =>
    gulp.watch(['src/**', 'tests/**'], ['test'])
);
