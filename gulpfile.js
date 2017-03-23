"use strict";
const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const concat       = require('gulp-concat');
const less         = require('gulp-less');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const minify       = require("gulp-minify-css");
const uglify       = require("gulp-uglify");
const reload       = browserSync.reload;
const sourcemaps   = require('gulp-sourcemaps');
const spritesmith  = require('gulp.spritesmith');
const del          = require('del');
const babel        = require('gulp-babel');
const fs 		   = require('fs');

const destPath     = './dist/';
const srcPath      = './src/';


const jsMap = [
	'js/controllers/*.js',
	'js/router.js',
	'js/main.js'
];


gulp.task('serve', ()=>{
	(new Promise((res, rej)=>{
		var packPort = process.env.npm_package_config_port;
		if(packPort){
			res(packPort);
		} else{
			fs.readFile(__dirname + '/package.json', 'utf8', function(err, data){
				if(err) throw err;
				var packageJSON = JSON.parse(data);
				if(!packageJSON.config){
					packageJSON.config = {};
				}
				res(packageJSON.config.port || 4420);
			});
		}
	})).then(port =>{
		browserSync.init({
			proxy: 'localhost:' + port,
			notify: false,
			open: false
		});
	}, err => {
		console.log(err);
	});
});

gulp.task('clean:imgs', ()=>{
	del(destPath + 'imgs/**/!(sprite).*');
});

gulp.task('jq', ()=>{
	return gulp.src(['node_modules/jquery/dist/jquery.js',
					 'node_modules/jquery-router-plugin/jquery.router.js',
					 'node_modules/mustache/mustache.min.js',
					 'node_modules/moment/moment.js',
					 'node_modules/moment/locale/ru.js',
					 'node_modules/fast-framework-core/core.js',])
	.pipe(concat('jqBt.js'))
	.pipe(uglify())
	.pipe(gulp.dest(destPath + 'js/'));
});

gulp.task('ie9', ()=>{
	return gulp.src(['/node_modules/dist/html5shiv/html5shiv.js',
					 '/node_modules/respond.js/dest/respond.min.js'])
		.pipe(concat('ie9.js'))
		.pipe(uglify())
		.pipe(gulp.dest(destPath + 'js/'));
});

gulp.task('bootstrap', ()=>{
	return gulp.src(srcPath + 'less/bootstrap.less')
		.pipe(less())
	    .pipe(autoprefixer({
	    	browsers: ['last 10 versions']
	    }))
	    .pipe(minify())
	    .pipe(rename('bootstrap.css'))
	    .pipe(gulp.dest(destPath + 'css/'))
	    .pipe(browserSync.stream());
});

gulp.task('js',()=>{
	return gulp.src(jsMap.map(el=>srcPath + el))
		.pipe(plumber({
	    	errorHandler: notify.onError('JS error: <%= error.message %>')
	    }))
	    .pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(concat('main-min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(destPath + 'js/'))
		.pipe(browserSync.stream());
});


gulp.task('less', ()=>{
	return gulp.src(srcPath + 'less/main.less')
		.pipe(plumber({
	    	errorHandler: notify.onError('LESS error: <%= error.message %>')
	    }))
	    .pipe(sourcemaps.init())
	    .pipe(less())
	    .pipe(autoprefixer({
	    	browsers: ['last 10 versions']
	    }))
	    .pipe(rename('style.css'))
	    .pipe(gulp.dest(destPath + 'css/'))
	    .pipe(minify())
	    .pipe(sourcemaps.write('./'))
	    .pipe(gulp.dest('./dist'))
	    .pipe(browserSync.stream());
});

gulp.task('sprite',()=>{
	let spriteData = 
		gulp.src(srcPath + 'imgs/sprite/*.*')
			.pipe(spritesmith({
			    imgName: 'sprite.png',
			    cssName: 'sprite.less',
			    imgPath: destPath.slice(1) + 'imgs/sprite.png'
			}));

	spriteData.img.pipe(gulp.dest(destPath + 'imgs/'));
    spriteData.css.pipe(gulp.dest(srcPath + 'less/'));
});

gulp.task('fonts', function () {
	gulp.src('src/fonts/*')
		.pipe(gulp.dest('dist/fonts'))
});

gulp.task('images',['clean:imgs'],()=>{
	return gulp.src([srcPath + 'imgs/**/*.*', '!' + srcPath + 'imgs/sprite/*.*'])
		.pipe(gulp.dest(destPath + 'imgs/'))
		.pipe(browserSync.stream());
});

gulp.task('watch', ()=>{
	gulp.watch([srcPath + 'js/**/*.js'], ['js']);
	gulp.watch([srcPath + 'less/!(bootstrap.less).less'], ['less']);
	gulp.watch([srcPath + 'less/bootstrap.less'], ['bootstrap']);
	gulp.watch([srcPath + 'imgs/sprite/*.*'], ['sprite']);
	gulp.watch([srcPath + 'imgs/**/*.*', '!' + srcPath + 'imgs/sprite/*.*'], ['images']);

	gulp.watch(['./*.html', 'views/**/*.mst'], reload);

});

gulp.task('build', ['js','less', 'bootstrap', 'jq', 'fonts', 'images', 'sprite', 'ie9']);

gulp.task('service', ['jq']);
gulp.task('default', ['build', 'serve', 'watch']);