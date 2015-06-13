'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	connect = require('gulp-connect'),
	jshint = require('gulp-jshint'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	open = require('gulp-open'),
	babel = require('gulp-babel'),

	paths = {
		html: './app/index.html',
		css: './app/styles/**/*.css',
		js: './app/js/**/*.js',
		es5: './app/.es5'
	};

gulp.task('html', function () {
	gulp.src(paths.html)
		.pipe(gulp.dest('./app/dist/'))
		.pipe(connect.reload());
});

gulp.task('css', function () {
	gulp.src(paths.css)
		.pipe(connect.reload());
});

gulp.task('lint', function() {
	gulp.src(paths.js)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('babel', function () {
	return gulp.src(paths.js)
		.pipe(babel())
		.pipe(gulp.dest(paths.es5));
});

gulp.task('browserify', function() {
	return browserify('./app/.es5/app.js', {debug: true})
		.bundle()
		.pipe(source('app.min.js'))
		.pipe(gulp.dest('./app/dist/js/'))
		.pipe(connect.reload());
});

gulp.task('server', function() {
	connect.server({
		root: 'app',
		livereload: true
	});
});

gulp.task('open', function () {
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
	gulp.watch([paths.js], ['lint', 'babel', 'browserify']);
});

gulp.task('default', function() {
	gulp.start('html', 'css', 'lint', 'babel', 'browserify', 'watch', 'open');
});
