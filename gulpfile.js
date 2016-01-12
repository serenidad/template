var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var useref       = require('gulp-useref'); 
var uglify       = require('gulp-uglify');
var gulpIf       = require('gulp-if');
var minifyCSS    = require('gulp-minify-css');
var cache        = require('gulp-cache');
var del          = require('del');
var runSequence  = require('run-sequence');
var jade         = require('gulp-jade');


// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('src/assets/css/**/*.scss') // Gets all files ending with .scss in src/assets/css and children dirs
    .pipe(sass()) // Passes it through a gulp-sass
    .pipe(autoprefixer()) // Passes it through gulp-autoprefixer 
    .pipe(gulp.dest('src/assets/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})


// Jade
gulp.task('jade', function(){
  return gulp.src('src/templates/*.jade')
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest('src'));
});



// Watchers
gulp.task('watch', function() {
  gulp.watch('src/assets/css/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload); 
  gulp.watch('src/assets/js/**/*.js', browserSync.reload);
  gulp.watch('src/templates/*.jade', ['jade']);
})


// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  var assets = useref.assets();

  return gulp.src('src/*.html')
    .pipe(assets)
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', minifyCSS()))
    // Uglifies only if it's a Javascript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});


// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(gulp.dest('dist/assets/img'))
});


// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('src/assets/fonts/**/*')
  .pipe(gulp.dest('dist/assets/fonts'))
})


// Cleaning 
gulp.task('clean:dev', function(){
  return del.sync([
  'dist/**/*'
  ]);
});


// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence('clean:dev', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})