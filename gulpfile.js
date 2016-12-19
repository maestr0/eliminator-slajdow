var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('sass', function(){
    return gulp.src('scss/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('firefox/css'))
});

gulp.task('build-es', function() {
    return gulp.src(['./js/jquery-2.0.3.js', './js/jquery-ui-1.10.3.widget-factory.js', './js/eliminator-slajdow.jquery.widget.js'])
        .pipe(concat('eliminator-slajdow.js'))
        .pipe(gulp.dest('./build/'));
});