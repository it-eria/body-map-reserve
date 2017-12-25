'use strict';

// Requires
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    wait = require('gulp-wait'),
    reload = browserSync.reload;
    
// Path
var path = {
    build: {
        css: 'typo3conf/ext/as_template/Resources/Public/StyleSheets/',
        img: 'typo3conf/ext/as_template/Resources/Images/'
    },
    src: {
        html: 'src/*.html',
        style: 'typo3conf/ext/as_template/Resources/Private/Scss/main.scss'
    },
    watch: {
        html: './*.html',
        js: 'typo3conf/ext/as_template/Resources/Public/JavaScript/**/*.js',
        style: 'typo3conf/ext/as_template/Resources/Private/Scss/**/**/*.scss',
        img: 'typo3conf/ext/as_template/Resources/Public/Images/**/*.*'
    }
};

// Config server
var config = {
    server: {
        baseDir: './',
        index: 'body-compass.html'
    },
    notify: false
};

// TASKS

// Task for build style files
gulp.task('style:build', function() {
    gulp.src(path.src.style)
        .pipe(wait(500))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError)) // Compile from scss to css
        .pipe(prefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: false})) // Add vender prefixes
        .pipe(rename({
            basename: 'style'
        }))
        .pipe(gulp.dest(path.build.css)) // Add to build folder
        .pipe(reload({stream: true})); // Reload server for updates        
});

gulp.task('reload', function() {
    gulp.src('').pipe(reload({stream: true}));
});

// Live reload
gulp.task('webserver', function() {
    browserSync(config);
});

// Build Task
gulp.task('build', [
    'style:build'
]);

// Watch task
gulp.task('watch', function() {
    // HTML
    watch([path.watch.html], function(event, callBack) {
        gulp.start('reload');
    });
    // STYLE
    watch([path.watch.style], function(event, callBack) {
        gulp.start('style:build');
    });
    // SCRIPTS
    watch([path.watch.js], function(event, callBack) {
        gulp.start('reload');
    });
    // IMAGES
    watch([path.watch.img], function(event, callBack) {
        gulp.start('reload');
    });
});

// Default task
gulp.task('default', ['build','webserver','watch']);