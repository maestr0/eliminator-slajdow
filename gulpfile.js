const gulp = require('gulp');
// Requires the gulp-sass plugin
const sass = require('gulp-sass');
var connect = require('gulp-connect');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const del = require('del');
const zip = require('gulp-zip');

gulp.task('build-es', function () {
    return gulp.src(['common/js/eliminator-slajdow-common.js'])
        .pipe(concat('eliminator-slajdow.js'))
        .pipe(gulp.dest('firefox/js/'))
        .pipe(gulp.dest('chrome/js/'));
});

gulp.task('chrome', gulp.series('build-es', () => {
    gulp.src('chrome/**')
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest('dist'));
}));

gulp.task('scss', function () {
    return gulp.src('common/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('chrome/css'))
        .pipe(gulp.dest('firefox/css'))
});

gulp.task('connect', function() {
    connect.server({
      root: 'build',
      livereload: false
    });
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
gulp.task('default', gulp.series('scss'));
