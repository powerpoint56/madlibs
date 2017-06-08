"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

gulp.task("js", () => {
    gulp.src(["jdom.js", "libs.js"])
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(uglify())
        .pipe(concat("build.js"))
        .pipe(gulp.dest("."));
});

gulp.task("default", ["js"]);