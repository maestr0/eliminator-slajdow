var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var del = require('del');

gulp.task('scss', function () {
    return gulp.src('scss/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('firefox/css'))
});

gulp.task('build-es', function () {
    return gulp.src(['./js/jquery-2.0.3.js', './js/eliminator-slajdow.js'])
        .pipe(concat('eliminator-slajdow.js'))
        .pipe(gulp.dest('./firefox/js/'));
});

gulp.task('webserver', function () {
    gulp.src('./build')
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
    gulp.watch('js/eliminator-slajdow.js', ['build-es']);
    gulp.watch('scss/**.scss', ['scss']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scss']);