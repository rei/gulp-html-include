'use strict';

var assert  = require('assert');
var gutil   = require('gulp-util');
var include = require('./index');
var path    = require('path');

var JS_INCLUDE          = '<script src="include/path/javascript.js"></script>';
var CSS_INCLUDE         = '<link href="include/path/style.css" rel="stylesheet" />';
var JS_ROOT             = '<script src="/javascript.js"></script>';
var CSS_ROOT            = '<link href="/style.css" rel="stylesheet" />';
var DEFAULT_JS_DEST     = 'javascript.js.html';
var DEFAULT_CSS_DEST    = 'style.css.html';

it('should generate HTML files to include JS files', function ( cb ) {
    var stream = include({ path: 'include/path' });

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, DEFAULT_JS_DEST );
        assert.equal( file.contents, JS_INCLUDE );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should generate HTML files to include CSS files', function ( cb ) {
    var stream = include({ path: 'include/path' });

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, DEFAULT_CSS_DEST );
        assert.equal( file.contents, CSS_INCLUDE );
        cb();
    });

    stream.write( new gutil.File({
        path: 'style.css',
        contents: new Buffer('')
    }));
});

it('should default the path to the root directory', function ( cb ) {
    var stream = include();

    stream.on( 'data', function ( file ) {
        assert.equal( file.contents, JS_ROOT );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should default the destination to the current directory', function ( cb ) {
    var stream = include();

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, DEFAULT_JS_DEST );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should normalize paths', function ( cb ) {
    var stream = include({ path: 'include/path' });

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, DEFAULT_JS_DEST );
        assert.equal( file.contents, JS_INCLUDE );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should use provided destinations', function ( cb ) {
    var stream = include({ dest: '../static/'});

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, path.normalize( '../static/javascript.js.html' ));
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});