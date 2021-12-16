const gulp = require("gulp");
const gulpIf = require("gulp-if");
const browserSync = require("browser-sync").create();
const sass = require("gulp-dart-sass");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const jsImport = require("gulp-js-import");
const sourcemaps = require("gulp-sourcemaps");

const clean = require("gulp-clean");
const isProd = process.env.NODE_ENV === "prod";

const htmlFile = ["src/*.html"];
const autoprefixer = require("gulp-autoprefixer");

const cssnano = require("gulp-cssnano");

const autoprefixerOptions = {
  overrideBrowserslist: ["last 2 versions", "> 5%", "Firefox ESR"],
};

function html() {
  return gulp
    .src(htmlFile)

    .pipe(
      gulpIf(
        isProd,
        htmlmin({
          collapseWhitespace: true,
        })
      )
    )
    .pipe(gulp.dest("dist"));
}

function css() {
  return gulp
    .src("src/sass/*.scss")
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: ["node_modules"],
      }).on("error", sass.logError)
    )

    .pipe(gulpIf(!isProd, sourcemaps.write()))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(
      gulpIf(
        isProd,
        cssnano({
          discardComments: { removeAll: true },
        })
      )
    )
    .pipe(cssnano({ discardComments: { removeAll: true } }))

    .pipe(gulp.dest("dist/css/"));
}

function js() {
  return gulp
    .src("src/js/*.js")
    .pipe(
      jsImport({
        hideConsole: true,
      })
    )
    .pipe(concat("all.js"))
    .pipe(gulpIf(isProd, terser()))
    .pipe(terser())
    .pipe(gulp.dest("dist/js"));
}

function img() {
  return gulp
    .src("src/img/**/*")
    .pipe(gulpIf(isProd, imagemin()))
    .pipe(gulp.dest("dist/img/"));
}

/***/
function pluginsJs() {
  return gulp
    .src("")
    .pipe(
      jsImport({
        hideConsole: true,
      })
    )
    .pipe(concat("plugins.js"))
    .pipe(gulpIf(isProd, terser()))
    .pipe(terser())
    .pipe(gulp.dest("dist/js"));
}
/**/

function serve() {
  browserSync.init({
    open: true,
    server: "./dist",
    port: 8080,
  });
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watchFiles() {
  gulp.watch("src/**/*.html", gulp.series(html, browserSyncReload));
  gulp.watch("src/**/*.scss", gulp.series(css, browserSyncReload));
  gulp.watch("src/**/*.js", gulp.series(js, browserSyncReload));
  gulp.watch("src/img/**/*.*", gulp.series(img, browserSyncReload));

  return;
}

function del() {
  return gulp.src("dist/*", { read: false }).pipe(clean());
}

exports.css = css;
exports.html = html;
exports.js = js;
exports.del = del;
exports.serve = gulp.parallel(html, css, js, img, watchFiles, serve);
exports.default = gulp.series(del, html, css, js, img);
