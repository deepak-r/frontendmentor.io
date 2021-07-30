const { src, dest, watch, series } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');

const browserSync = require('browser-sync').create();

const files = {
  distPath: './dist',
  distCSSPath: './dist/css',
  htmlPath: './dist/**/*.html',
  scssPath: './src/scss/**/*.scss',
};

// Sass Task
function scssTask() {
  return src(files.scssPath, { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename('style.min.css'))
    .pipe(dest(files.distCSSPath, { sourcemaps: '.' }));
}

// browsersync
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: files.distPath,
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// watch task
function watchTask() {
  watch(files.htmlPath, browserSyncReload);
  watch([files.scssPath], series(scssTask, browserSyncReload));
}

// default gulp task
exports.default = series(scssTask, browserSyncServe, watchTask);
