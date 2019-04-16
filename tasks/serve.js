var gulp = require('gulp');
var liveServer = require('live-server');
var config = require('../gulp.config')();

/* Start live server dev mode */
gulp.task('serve-dev', ['inject-dependencies-dev', 'tsc-app', 'watch-ts', 'watch-sass'], function () {
    liveServer.start(config.liveServer.dev);
});

/* Start the live server with the config.developmentAppContainer */
gulp.task('serve-prod', ['package-dev'], function () {
    liveServer.start(config.liveServer.prod);
});