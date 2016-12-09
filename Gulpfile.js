const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const notify = require('gulp-notify');
const path = require('path');

const directories = {
  SRC: 'src',
  DIST: 'dist',
};

function handleErrors(...args) {
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
  }).apply(this, args);
  this.emit('end');
}

function isJavascript(filename) {
  return /\.js$/.test(filename);
}

function transpileFiles(srcDirectory, distDirectory) {
  gulp.src(path.join(srcDirectory, '**/*.js'))
    .on('error', handleErrors)
    .pipe(babel({
      presets: ['es2015', 'airbnb', 'stage-0'],
    }))
    .pipe(gulp.dest(distDirectory));
}


gulp.task('transpile', () => {
  transpileFiles(directories.SRC, directories.DIST);
  console.log('Updated build!');
});


gulp.task('watch', () => {
  watch('src', () => {
    transpileFiles(directories.SRC, directories.DIST);
    console.log('Updated build!');
  });
});

gulp.task('default', ['transpile', 'watch']);
