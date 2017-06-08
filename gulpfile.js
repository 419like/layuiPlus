var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var del = require('del');
var mkdirp = require('mkdirp');

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    console.log('build----------发布项目');
});


gulp.task('html', function() {
    return gulp.src('demo.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
    mkdirp('dist/lib', function(err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
    gulp.src('lib/jquery.min.js')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('clean', function(cb) {
    del([
        'dist/**/*',
    ], cb);
});

gulp.task('build', ['clean', 'copy', 'html']);
