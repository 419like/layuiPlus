var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var del = require('del');
var webserver = require('gulp-webserver');
var vinylPaths = require('vinyl-paths');
var readline = require('readline');
const confirm = require('gulp-confirm');
const git = require('gulp-git');

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    console.log('build----------发布项目');
    gulp.run('build')
});

gulp.task('html', function() {
    return gulp.src('demo.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
    gulp.src(['lib/jquery.min.js', 'lib/layui.css'])
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(gulp.dest('dist'))
        .pipe(vinylPaths(del));
});

gulp.task('willPublic', function() {
    gulp.src('')
    .pipe(confirm({
      // Static text. 
      question: 'will you publish on github?',
      input: '_key:y'
    }))
    .pipe(git.add({args: '--all'}));

})

gulp.task('build', ['clean', 'copy', 'html', 'willPublic']);

gulp.task('server', function() {
    gulp.src('')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: true
        }));
});
