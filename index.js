'use strict';
var _           = require( 'lodash' );
var path        = require( 'path' );
var gutil       = require( 'gulp-util' );
var through     = require( 'through2' );

function _normalizePath ( input ) {
    var len = input.length;
    var end = input[ len - 1 ];
    return input + (end === '/' ? '' : '/');
}

var PLUGIN_NAME = 'gulp-html-include';

module.exports = function ( options ) {
    var config = {
        dest: './',
        path: '/',
        xhtml: false
    };
    _.assign( config, options );
    config.path = _normalizePath( config.path );

    return through.obj(function ( file, enc, cb ) {
        if ( file.isNull() ) {
            this.push( file );
            return cb();
        }

        if ( file.isStream() ) {
            throw new gutil.PluginError({
                plugin: PLUGIN_NAME,
                message: 'Streaming not supported'
            });
        }

        var fileName = path.basename( file.path );
        var fileType = path.extname( fileName );
        var htmlName = fileName + '.html';
        var template;

        if ( fileType === '.js' ) {
            template = '<script src="<%= path %>"></script>';
        } else if ( fileType === '.css' ) {
            if ( config.xhtml ) {
                template = '<link href="<%= path %>" rel="stylesheet" />';
            } else {
                template = '<link href="<%= path %>" rel="stylesheet">';
            }
        } else {
            this.push( file );
            return cb();
        }

        var includeContents = _.template( template )({
            path: config.path + fileName
        });

        var htmlFile = new gutil.File({
            base:       config.dest,
            contents:   new Buffer( includeContents ),
            path:       path.join( config.dest, htmlName )
        });

        this.push( htmlFile );

        gutil.log( 'Generating file', htmlFile.path );

        return cb();
    });
};
