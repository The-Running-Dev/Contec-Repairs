var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../gulp.config')();
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var mainBowerFiles = require('main-bower-files');
var Builder = require('systemjs-builder');

gulp.task('package', function (done) {
    runSequence('build-app-prod', 'tsc-app', 'systemJs', done);
});

gulp.task('package-dev', function (done) {
    runSequence('build-app-dev', 'tsc-app', 'systemJs', done);
});

/* Concatenate and minify/uglify all css, js, copy assets, app files for production */
gulp.task('build-app-prod', function (done) {
    runSequence('clean-build', ['inject-dependencies-prod', 'copy-assets', 'app'], function () {
        done();

        // Process the config.build.container file
        return gulp.src(config.productionAppContainer)
            .pipe(useref())
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', cssnano({zindex: false})))
            .pipe(gulpif('!*.aspx', rev()))
            .pipe(revReplace({
                replaceInExtensions: ['.aspx']
            }))
            .pipe(gulp.dest(config.build.path));
    });
});

/* Concatenate and minify/uglify all css, js, copy assets, app files for development */
gulp.task('build-app-dev', function (done) {
    runSequence('clean-build', ['inject-dependencies-dev', 'copy-assets', 'app'], function () {
        done();

        // Process the config.developmentAppContainer file
        return gulp.src(config.developmentAppContainer)
            .pipe(useref())
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', cssnano()))
            .pipe(gulpif('!*.html', rev()))
            .pipe(revReplace())
            .pipe(gulp.dest(config.build.path));
    });
});

/* Prepare build using the SystemJS builder */
gulp.task('systemJs', function () {
    var builder = new Builder();

    builder.loadConfig('./systemjs.config.js')
    .then(function () {
        return builder
            .bundle(config.app + 'main',
                    config.build.path + config.app + 'main.js',
            config.systemJs.builder);
    })
    .catch(function (ex) {
        console.log('Build Failed', ex);
    });
});

/* Copy all app files */
gulp.task('app', function () {
    // Copy all .html files under config.app
    gulp.src(config.app + '**/*.html', { base: config.app })
        .pipe(gulp.dest(config.build.app));

    // Copy and minify all .css files under config.app
    gulp.src(config.app + '**/*.css', { base: config.app })
        .pipe(cssnano())
        .pipe(gulp.dest(config.build.app));
});

/* Copy assets */
gulp.task('copy-assets', function () {
    // Copy all images from assets/images
    gulp.src(config.assetsPath.images + '**/*.*', { base: config.assetsPath.images })
        .pipe(gulp.dest(config.build.assetPath + 'images'));

    // Copy all images from primeui
    gulp.src(config.assetsPath.primeuiImages)
        .pipe(gulp.dest(config.build.assetPath + 'images'));

    // Copy all images from bower
    gulp.src(mainBowerFiles({ filter: '**/images/*.*' }))
        .pipe(gulp.dest(config.build.assetPath + 'images'));

    // Copy all fonts from assets/fonts
    gulp.src(config.assetsPath.fonts + '**/*.*', { base: config.assetsPath.fonts })
        .pipe(gulp.dest(config.build.fonts));

    // Copy all fonts from primui/fonts
    gulp.src(config.assetsPath.primeuiFonts)
        .pipe(gulp.dest(config.build.fonts));

    // Copy all fonts from bower
    gulp.src(mainBowerFiles({ filter: '**/fonts/*.*' }))
        .pipe(gulp.dest(config.build.fonts));
});

/* Inject the dependencies (through bower main files) into the development index file */
gulp.task('inject-dependencies-dev', ['sass'], function () {
    return gulp.src(config.developmentAppContainer)
        .pipe(inject(gulp.src(mainBowerFiles(), { read: false }), { name: 'bower' }))
        .pipe(inject(gulp.src(config.assetsPath.styles + 'main.css', { read: false }), { name: 'app' }))
        .pipe(gulp.dest(config.root));
});

/* Inject the dependencies (through bower main files) into the production index file */
gulp.task('inject-dependencies-prod', ['sass'], function () {
    return gulp.src(config.productionAppContainer)
        .pipe(inject(gulp.src(mainBowerFiles('!**/jquery/**'), { read: false }), { name: 'bower' }))
        .pipe(inject(gulp.src(config.assetsPath.styles + 'main.css', { read: false }), { name: 'app' }))
        .pipe(gulp.dest(config.root));
});