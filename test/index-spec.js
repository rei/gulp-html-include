'use strict';

var assert      = require( 'assert' );
var gutil       = require( 'gulp-util' );
var include     = require( '../index' );
var path        = require( 'path' );

var JS_INCLUDE          = '<script src="include/path/javascript.js"></script>';
var CSS_INCLUDE         = '<link href="include/path/style.css" rel="stylesheet">';
var CSS_INCLUDE_XHTML   = '<link href="include/path/style.css" rel="stylesheet" />';
var JS_ROOT             = '<script src="/javascript.js"></script>';
var CSS_ROOT            = '<link href="/style.css" rel="stylesheet">';
var CSS_ROOT_XHTML      = '<link href="/style.css" rel="stylesheet" />';
var DEFAULT_JS_DEST     = 'javascript.js.html';
var DEFAULT_CSS_DEST    = 'style.css.html';

var out = process.stdout.write;

beforeEach(function () {
    process.stdout.write = function () {};
});

afterEach(function () {
    process.stdout.write = out;
});

describe('File Generation', function () {

    it('should generate HTML files to include JS files', function ( done ) {
        var stream = include({ path: 'include/path' });

        stream.on( 'data', function ( file ) {
            assert.equal( file.path, DEFAULT_JS_DEST );
            assert.equal( file.contents, JS_INCLUDE );
            done();
        });

        stream.write( new gutil.File({
            path: 'javascript.js',
            contents: new Buffer('')
        }));
    });

    it('should generate HTML files to include CSS files', function ( done ) {
        var stream = include({ path: 'include/path' });

        stream.on( 'data', function ( file ) {
            assert.equal( file.path, DEFAULT_CSS_DEST );
            assert.equal( file.contents, CSS_INCLUDE );
            done();
        });

        stream.write( new gutil.File({
            path: 'style.css',
            contents: new Buffer('')
        }));
    });

    it('should generate XHTML-compliant files to include CSS files', function ( done ) {
        var stream = include({ path: 'include/path', xhtml: true });

        stream.on( 'data', function ( file ) {
            assert.equal( file.path, DEFAULT_CSS_DEST );
            assert.equal( file.contents, CSS_INCLUDE_XHTML );
            done();
        });

        stream.write( new gutil.File({
            path: 'style.css',
            contents: new Buffer('')
        }));
    });

});

describe('Include Pathing', function () {

    it('should default the path to the root directory', function ( done ) {
        var stream = include();

        stream.on( 'data', function ( file ) {
            assert.equal( file.contents, JS_ROOT );
            done();
        });

        stream.write( new gutil.File({
            path: 'javascript.js',
            contents: new Buffer('')
        }));
    });

    it('should normalize paths', function ( done ) {
        var stream = include({ path: 'include/path' });

        stream.on( 'data', function ( file ) {
            assert.equal( file.path, DEFAULT_JS_DEST );
            assert.equal( file.contents, JS_INCLUDE );
            done();
        });

        stream.write( new gutil.File({
            path: 'javascript.js',
            contents: new Buffer('')
        }));
    });

});

describe('Output Destinations', function () {

    it('should default the destination to the current directory', function ( done ) {
        var stream = include();

        stream.on( 'data', function ( file ) {
            assert.equal( file.path, DEFAULT_JS_DEST );
            done();
        });

        stream.write( new gutil.File({
            path: 'javascript.js',
            contents: new Buffer('')
        }));
    });

    it('should use provided destinations', function ( done ) {
        var stream = include({ dest: '../static/'});

        stream.on( 'data', function ( file ) {
            assert.equal( file.path, path.normalize( '../static/javascript.js.html' ));
            done();
        });

        stream.write( new gutil.File({
            path: 'javascript.js',
            contents: new Buffer('')
        }));
    });

});