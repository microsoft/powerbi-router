var gulp = require('gulp-help')(require('gulp'));
var del = require('del'),
    karma = require('karma'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config'),
    webpackE2eConfig = require('./webpack.e2e.config'),
    runSequence = require('run-sequence'),
    argv = require('yargs').argv
    ;

gulp.task('build', 'Compile source files', function () {
    return gulp.src(['typings/**/*.d.ts', './src/**/*.ts'])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', 'Run unit tests', function (done) {
    return runSequence(
        'compile:spec',
        'test:spec',
        done
    )
});

gulp.task('compile:spec', 'Compile typescript for tests', function () {
    return gulp.src(['typings/**/*.d.ts', './src/**/*.ts', './test/**/*.spec.ts'])
        .pipe(webpack(webpackE2eConfig))
        .pipe(gulp.dest('./tmp'));
});

gulp.task('test:spec', 'Runs spec tests', function(done) {
    new karma.Server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: argv.watch ? false : true,
        captureTimeout: argv.timeout || 20000
    }, done);
});