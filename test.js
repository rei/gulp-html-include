'use strict';

var assert  = require('assert');
var gutil   = require('gulp-util');
var include = require('./index');

var JS_INCLUDE    = '<script src="include/path/javascript.js"></script>';
var CSS_INCLUDE   = '<link href="include/path/style.css" rel="stylesheet" />';
var JS_ROOT       = '<script src="/javascript.js"></script>';
var CSS_ROOT      = '<link href="/style.css" rel="stylesheet" />';

it('should default to the root directory', function ( cb ) {
    var stream = include();

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, 'javascript.js.html' );
        assert.equal( file.contents, JS_ROOT );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should normalize paths', function ( cb ) {
    var stream = include('include/path');

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, 'javascript.js.html' );
        assert.equal( file.contents, JS_INCLUDE );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should generate HTML files to include JS files', function ( cb ) {
    var stream = include('include/path/');

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, 'javascript.js.html' );
        assert.equal( file.contents, JS_INCLUDE );
        cb();
    });

    stream.write( new gutil.File({
        path: 'javascript.js',
        contents: new Buffer('')
    }));
});

it('should generate HTML files to include CSS files', function ( cb ) {
    var stream = include('include/path/');

    stream.on( 'data', function ( file ) {
        assert.equal( file.path, 'style.css.html' );
        assert.equal( file.contents, CSS_INCLUDE );
        cb();
    });

    stream.write( new gutil.File({
        path: 'style.css',
        contents: new Buffer('')
    }));
});
