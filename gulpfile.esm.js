import { src, dest, watch, series } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
const sync = browserSync.create();
const sass = gulpSass(dartSass);

function scssTask() {
    return src('assets/scss/main.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer, cssnano]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('assets/css', { sourcemaps: '.' }));
}

function browserSyncServe(cb) {
    sync.init({
        server: {
            baseDir: './',
        },
    });
    cb();
}

function browserSyncReload(cb) {
    sync.reload();
    cb();
}

function watchTask() {
    watch('*.html', browserSyncReload);
    watch(['assets/scss/**/*.scss'], series(scssTask, browserSyncReload));
}

exports.default = series(scssTask, browserSyncServe, watchTask);
