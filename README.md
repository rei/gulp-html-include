# gulp-include-generator

> HTML include generator for static assets, e.g., foo.min.js => foo.min.js.html

## Usage

This plugin generates an HTML file with solely a `script` or `link` reference to JS or CSS files passed to it, respectively. It pairs well with gulp-rev and gulp-rename to make it easy to include dynamically named static files (e.g., via JSP `include`). Now you can enjoy versioned files without having to manually update the references to your generated files.

```
gulp.src( '/path/to/my/files' )
    .pipe( rev() )
    .pipe( include() )
    .pipe( rename(function ( dir, base, ext ) {
        return path.join( dest, 'html', base.replace( /\-[^\.]+/, '' ) + ext );
    }))
    .pipe( gulp.dest('/path/to/web/root') )
```

You can optionally pass in the path to prefix these files with, e.g., `/static/` (the default is `/`).

```
gulp.src( '/path/to/my/files' )
    .pipe( rev() )
    .pipe( include( '/static/' ) )
    .pipe( rename(function ( dir, base, ext ) {
        return path.join( dest, 'html', base.replace( /\-[^\.]+/, '' ) + ext );
    }))
    .pipe( gulp.dest( '/path/to/web/root' ) )
```

## Testing

You can run the tests with Mocha by running `mocha` in the project directory. If you don't have Mocha installed, you'll want to do that first.

```
npm install -g mocha
```