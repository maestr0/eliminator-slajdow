var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var del = require('del');
const zip = require('gulp-zip');

gulp.task('chrome', ['build-es'], () => {
    return gulp.src('chrome/**')
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('scss', function () {
    return gulp.src('common/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('chrome/css'))
        .pipe(gulp.dest('firefox/css'))
});

gulp.task('build-es', function () {
    gulp.src(['common/js/eliminator-slajdow-common.js'])
        .pipe(concat('eliminator-slajdow.js'))
        .pipe(gulp.dest('firefox/js/'))
        .pipe(gulp.dest('chrome/js/'));

    return gulp.src(['common/js/eliminator-slajdow-page-configs.js'])
        .pipe(gulp.dest('firefox/js/'))
        .pipe(gulp.dest('chrome/js/'));
});

gulp.task('webserver', function () {
    gulp.src('build')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: true
        }));
});

function clean(done) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build'], done);
}

gulp.task('clean', clean);

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('common/js/eliminator-slajdow-common.js', ['build-es']);
    gulp.watch('common/scss/**.scss', ['scss']);
});

// gulp.task('copy-tmp', function () {
//     gulp.src('./tmp')
//         .pipe(gulp.dest('./public/'));
// });

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scss']);