// File: Gulpfile.js
'use strict';

var gulp      = require('gulp'),
    connect   = require('gulp-connect'),
    stylus    = require('gulp-stylus'),
    nib       = require('nib'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    inject    = require('gulp-inject'),
    wiredep   = require('wiredep').stream,
    gulpif    = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref    = require('gulp-useref'),
    uglify    = require('gulp-uglify'),
    uncss     = require('gulp-uncss'),
    war       = require('gulp-war'),
    zip       = require('gulp-zip'),
    jasmine   = require('gulp-jasmine'),
    Server    = require('karma').Server,
    replace   = require('gulp-replace'),
    del       = require('del'),
    angularFilesort = require('gulp-angular-filesort'),
    templateCache = require('gulp-angular-templatecache'),
    historyApiFallback = require('connect-history-api-fallback');

// Servidor web de desarrollo
gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8083,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});

// Servidor web para probar el entorno de producción
gulp.task('server-dist', function() {
  connect.server({
    root: './dist',
    hostname: '0.0.0.0',
    port: 80,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
  gulp.src('./app/stylesheets/main.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest('./app/stylesheets'))
    .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// Busca en las carpetas de estilos y javascript los archivos
// para inyectarlos en el index.html
gulp.task('inject', function() {
  return gulp.src('index.html', {cwd: './app'})
    .pipe(inject(
      gulp.src(['./app/scripts/**/*.js']).pipe(angularFilesort()), {
      read: false,
      ignorePath: '/app'
    }))
    .pipe(inject(
      gulp.src(['./app/stylesheets/**/*.css']), {
        read: false,
        ignorePath: '/app'
      }
    ))
    .pipe(gulp.dest('./app'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory: './app/lib'
    }))
    .pipe(gulp.dest('./app'));
});

// Compila las plantillas HTML parciales a JavaScript
// para ser inyectadas por AngularJS y minificar el código
gulp.task('templates', function() {
  gulp.src('./app/views/**/*.tpl.html')
    .pipe(templateCache({
      root: 'views/',
      module: 'app.templates',
      standalone: true
    }))
    .pipe(gulp.dest('./app/scripts'));
});

// Comprime los archivos CSS y JS enlazados en el index.html
// y los minifica.
gulp.task('compress', function() {
  gulp.src('./app/index.html')
    .pipe(useref.assets())
    .pipe(gulpif('*.js', uglify({mangle: false })))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./dist'));
});

// Lleva los fuentes js directamente al dist
gulp.task('install', function() {
  gulp.src('./app/index.html')
    .pipe(useref.assets())
    .pipe(gulp.dest('./dist'));
});

// Elimina el CSS que no es utilizado para reducir el peso del archivo
gulp.task('uncss', function() {
  gulp.src('./dist/css/style.min.css')
    .pipe(uncss({
      html: ['./app/index.html', './app/views/account-list.tpl.html', './app/views/account-detail.tpl.html']
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Copia el contenido de los estáticos e index.html al directorio
// de producción sin tags de comentarios
gulp.task('copy', function() {
  gulp.src('./app/index.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist'));
  gulp.src('./app/config.json')
    .pipe(gulp.dest('./dist'));
});

// Copia las plantillas html al directorio de las vistas de la distribución.
gulp.task('copyhtml', function() {
  gulp.src('app/views/**/*.html', {base: 'app/views'})
    .pipe(gulp.dest('dist'));
});

// Copia el directorio con las fuentes utilizadas por Bootstrap al directorio de producción.
gulp.task('copyfonts', function() {
  gulp.src('app/fonts/*.*', {base: 'app/fonts'})
    .pipe(gulp.dest('dist/fonts'));
});

// Copia el directorio con la internacionalizaciones soportadas al directorio de producción.
gulp.task('copyi18n', function() {
  gulp.src('app/i18n/*.*', {base: 'app/i18n'})
    .pipe(gulp.dest('dist/i18n'));
});

// Copia el directorio con la internacionalizaciones soportadas al directorio de producción.
gulp.task('copyimg', function() {
  gulp.src('app/img/*.*', {base: 'app/img'})
    .pipe(gulp.dest('dist/img'));
});

// Genera un Java WAR para poder desplegar en un Servidor de Aplicaciones
gulp.task('war', function () {
    gulp.src(['./dist/**/*.js', './dist/**/*.css', './dist/**/*.html', './dist/**/fonts/*.*', './dist/**/i18n/*.*', './dist/**/*.json', './dist/**/img/*.*' ])
        .pipe(war({
            welcome: 'index.html',
            displayName: 'CloudIDoc Validation Demo WAR',
            webappExtras: [ '<error-page><error-code>404</error-code><location>/</location></error-page>']
        }))
        .pipe(zip('CloudIDocValidationDemo.war'))
        .pipe(gulp.dest("./target"));

});

// Ejecuta los test unitarios con karma
gulp.task('test', function (done) {

  var config = {
      configFile: __dirname + '/karma.conf.js',
      browsers: ['PhantomJS'],
      singleRun: true
    };

  var server = new Server(config, done)
  server.start();
});

///////////////////////////////////////////////////////////////////////////////////////
// Tareas propias del sistema de integración

// Ejecuta los test unitarios con karma
gulp.task('test-ci', function (done) {

  var config = {
      configFile: __dirname + '/karma.conf.ci.js'
    };

  var server = new Server(config, done)
  server.start();
});

// Elimina el directorio donde se genera la versión distribuible.
gulp.task('clean', function(cb) {
  del.sync(['dist'], cb);
});

///////////////////////////////////////////////////////////////////////////////////////

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html', '!index.html'], ['html', 'templates']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
  // gulp.watch(['./app/scripts/**/*.js', './test/**/*.js', './Gulpfile.js'], ['jshint', 'inject', 'test']);
  gulp.watch(['./app/scripts/**/*.js', './test/**/*.js', '!templates.js'], ['jshint', 'test']);
  gulp.watch(['./bower.json'], ['wiredep']);
  // gulp.watch(['./test/**/*.js'], ['test']);
});

gulp.task('default', ['server', 'templates', 'inject', 'wiredep', 'watch', 'test']);
gulp.task('build', ['clean', 'templates', 'compress', 'copy', 'uncss', 'copyfonts', 'copyi18n', 'copyimg']);
gulp.task('build-debug', ['templates', 'install', 'copy', 'uncss', 'copyfonts', 'copyi18n', 'copyimg']);
gulp.task('target', ['war']);
