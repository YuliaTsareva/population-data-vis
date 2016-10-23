'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    open = require('gulp-open'),
    babel = require('gulp-babel'),

    paths = {
        html: './app/index.html',
        css: './app/styles/**/*.css',
        data: './app/data/**/*.*',
        js: './app/js/**/*.js',
        es5: './app/.es5/**/*.js'
    },

    target = {
        html: './app/dist',
        css: './app/dist/styles',
        data: './app/dist/data',
        js: './app/dist/js',
        es5: './app/.es5'
    };

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(gulp.dest(target.html))
        .pipe(connect.reload());
});

gulp.task('css', function() {
    gulp.src(paths.css)
        .pipe(gulp.dest(target.css))
        .pipe(connect.reload());
});

gulp.task('data', function() {
    gulp.src(paths.data)
        .pipe(gulp.dest(target.data))
        .pipe(connect.reload());
});

gulp.task('lint', function() {
    gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('babel', function() {
    return gulp.src(paths.js)
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(target.es5));
});

gulp.task('browserify', ['babel'], function() {
    return browserify('./app/.es5/app.js', {debug: true})
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(gulp.dest(target.js))
        .pipe(connect.reload());
});

gulp.task('server', ['html', 'css', 'data', 'lint', 'browserify'], function(done) {
    connect.server({
        root: 'app/dist',
        livereload: true
    });
    done();
});

gulp.task('open', ['server'], function() {
    var options = {
        url: 'http://localhost:8080',
        app: 'Google Chrome'
    };
    gulp.src('./app/dist/index.html')
        .pipe(open('', options));
});

gulp.task('watch', function() {

    gulp.start('server');

    gulp.watch([paths.html], ['html']);
    gulp.watch([paths.css], ['css']);
    gulp.watch([paths.data], ['data']);
    gulp.watch([paths.js], ['lint', 'babel', 'browserify']);
});

gulp.task('build', ['html', 'css', 'data', 'lint', 'babel', 'browserify']);
gulp.task('default', ['build', 'watch', 'open']);

