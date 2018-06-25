const gulp = require('gulp');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const htmlclean = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const del = require('del');

const paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcSASS: 'src/**/*.scss',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',

    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpSASS: 'tmp/**/*.scss',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',

    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

gulp.task('html', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function () {
    return gulp.src(paths.srcSASS)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist))
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS)
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function () {
    return gulp.src(paths.srcJS)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', ['html', 'sass', 'css', 'js']);

gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, {
            relative: true
        }))
        .pipe(inject(js, {
            relative: true
        }))
        .pipe(gulp.dest(paths.dist))
})

gulp.task('build', ['inject']);

gulp.task('serve', ['build'], function () {
    return gulp.src(paths.dist)
        .pipe(webserver({
            port: 3000,
            livereload: true
        }));
})

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.src, ['inject']);
})

gulp.task('clean', function () {
    del([paths.tmp, paths.dist]);
})

gulp.task('default', ['watch']);