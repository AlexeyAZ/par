const properties = {
    folders: {
      build: 'build',
      src: 'src',
    }
}

const plugins = {
    js: [
        'bower_components/jquery/dist/jquery.min.js',
    ],
    css: [
        'bower_components/reset-css/reset.css',
    ]
}

const gulp = require('gulp'),
    connect = require('gulp-connect')
    bs = require("browser-sync").create(),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer')
    babel = require('gulp-babel'),
    rigger = require('gulp-rigger'),
    watch = require('gulp-watch');
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    typograf = require('gulp-typograf'),
    eslint = require('gulp-eslint');

function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('browserSync', function() {
  bs.init({
    server: {
      baseDir: "./build"
    },
    //port: 8080,
    open: true,
    notify: false,
    https: true
  });
});

gulp.task('lint', function () {
    return gulp.src(properties.folders.src + '/scripts/**/*.*')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('scripts', function() {
    return gulp.src([properties.folders.src + '/scripts/app.js'])
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(babel())
        .on('error', onError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(properties.folders.build + '/scripts'))
        .pipe(bs.stream());
});

gulp.task('vendor', function () {
    gulp.src(plugins.css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(properties.folders.build + '/styles/'));
    gulp.src(plugins.js)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('pug', function() {
    gulp.src(properties.folders.src + '/views/*.pug')
          .pipe(pug({
            pretty: true
    }))
    .on('error', onError)
    .pipe(gulp.dest(properties.folders.build))
    .on('end', function(){
        gulp.src(properties.folders.build + '/**/*.html')
            .pipe(typograf({
                locale: ['ru', 'en-US'],
                enableRule: ["common/nbsp/afterNumber"]
            }))
            .pipe(gulp.dest(properties.folders.build))
            .pipe(bs.stream({once: true}));
    });
});

gulp.task('sass', function () {
    gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'))
        .pipe(bs.stream());
});

gulp.task('image', function () {
    gulp.src(properties.folders.src + '/img/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/img'))
});

gulp.task('svgSpriteBuild', function () {
	  return gulp.src(properties.folders.src + '/img/**/*.svg')
    // minify svg
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
    }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "../sprite.svg",
                render: {
                    scss: {
                        dest: '../../styles/_sprite.scss',
                        template: properties.folders.src + "/styles/svg-templates/_sprite_template.scss"
                    }
                }
            }
        }
    }))
    .pipe(gulp.dest(properties.folders.src + '/sprite/'));
});

gulp.task('video', function () {
    gulp.src(properties.folders.src + '/video/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/video'))
});

gulp.task('font', function () {
    gulp.src(properties.folders.src + '/fonts/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/fonts'))
});

gulp.task('json', function () {
    gulp.src(properties.folders.src + '/json/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/json'))
});

gulp.task('server', function() {
    connect.server({
        port: properties.port,
        root: properties.folders.build,
        livereload: true
    });
});

gulp.task('build', [
    'pug',
    'sass',
    'scripts',
    'lint',
    'vendor',
    'image',
    'video',
    'font',
    'json',
    'svgSpriteBuild'
]);

gulp.task('watch', function() {
    watch(properties.folders.src + '/views/**/*.pug', function() {
        gulp.start('pug');
    });
    watch(properties.folders.src + '/styles/**/*.scss', function() {
        gulp.start('sass');
    });
    watch(properties.folders.src + '/scripts/**/*.js', function() {
        gulp.start(['lint', 'scripts']);
    });
    watch(properties.folders.src + '/img/**/*.*', function() {
        gulp.start('image');
    });
    watch(properties.folders.src + '/img/slide5/**/*.svg', function() {
        gulp.start('svgSpriteBuild');
    });
    watch(properties.folders.src + '/video/**/*.*', function() {
        gulp.start('video');
    });
    watch(properties.folders.src + '/font/**/*.*', function() {
        gulp.start('font');
    });
    watch(properties.folders.src + '/json/**/*.*', function() {
        gulp.start('json');
    });
});

gulp.task('default', ['lint', 'build', 'browserSync', 'watch']);
