const gulp = require('gulp');
const dest = gulp.dest;
const install = require("gulp-install");
const lambda = require('gulp-awslambda');
const zip = require('gulp-zip');

const del = require('del');
const path = require('path');
const fs = require("fs");

const opts = { region: 'us-east-1' };
const distFolder = "./dist";
const tmpFolder = distFolder + "/tmp";
const lambdaFunctionZipNameMap = [
    "authentication_post.zip", "PostAuthenticate",
    "players_get.zip", "GetPlayers"
]

gulp.task('clean', function () {
    return del([distFolder]);
});

gulp.task('getPlayers', function () {
    const lambda_params = "GetPlayers";
    return gulp.src('./api/players/get/index.js')
        .pipe(zip('getPlayers.zip'))
        .pipe(lambda(lambda_params, opts))
        .pipe(dest('./dist'));
});

gulp.task('postAuthenticate', function () {
    const lambda_params = "PostAuthenticate";
    return gulp.src('./api/authenticate/post/index.js')
        .pipe(zip('getPlayers.zip'))
        .pipe(lambda(lambda_params, opts))
        .pipe(dest('./dist'));
});

gulp.task('copy', ['clean'], function () {
    return gulp.src("./api/**/*")
        .pipe(dest(tmpFolder));
});

gulp.task('install', ['clean', 'copy'], function () {
    return gulp.src(path.join(tmpFolder, "/**/*"))
        .pipe(install({ production: true }))
});

gulp.task('zip', ['clean', 'copy', 'install'], function () {
    const folders = getFolders(tmpFolder);
    const tasks = [].concat(folders.map(function (childFolder) {
        const grandChildFolders = getFolders(path.join(tmpFolder, childFolder));
        return grandChildFolders.map(function (grandChildFolder) {
            return gulp.src(path.join(tmpFolder, childFolder, grandChildFolder, '/**/*'))
                .pipe(zip(childFolder + "_" + grandChildFolder + ".zip"))
                .pipe(dest(distFolder))
        });
    }));
    return tasks;
})

gulp.task('publish', ['clean', 'copy', 'install', 'zip'], function () {
    const zipFiles = getFiles(distFolder);
    const tasks = zipFiles.map(function(zipFile) {

    });
    return tasks;    
});

gulp.task('default', ['publish']);

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function getFiles(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return !fs.statSync(path.join(dir, file)).isDirectory();
        });
}