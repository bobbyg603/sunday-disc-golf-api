const gulp = require('gulp');
const lambda = require('gulp-awslambda');
const zip = require('gulp-zip');

const lambda_params = "GetPlayers";
const opts = { region: 'us-east-1' };

gulp.task('getPlayers', function () {
    return gulp.src('./api/players/get/index.js')
        .pipe(zip('getPlayers.zip'))
        .pipe(lambda(lambda_params, opts))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['getPlayers']);