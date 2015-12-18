/*
 * grunt-sass-recursive-import
 * https://github.com/Schepp/grunt-sass-recursive-import
 *
 * Copyright (c) 2015 Christian Schaefer
 * Licensed under the MIT license.
 *
 * Strong based on grunt-sass-directory-import
 * by Nate Eagle
 * https://www.npmjs.com/package/grunt-sass-directory-import
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask(
        'sass_recursive_import',
        'Recursively includes SASS Partials in all Subdirectories',
        function () {
            var files = this.filesSrc;
            var quiet = this.options().quiet;
            files.forEach(function (filepath) {
                // Create an array that we'll ultimately use to populate our includes file
                var newFileContents = [
                    // Header
                    '// This file imports all other underscore-prefixed .scss files in this directory.',
                    '// It is automatically generated by the grunt-sass-recursive-import task.',
                    '// Do not directly modify this file.',
                    ''
                ];
                var directory = filepath.substring(0, filepath.lastIndexOf('/'));

                // Search for underscore prefixed scss files
                // Then remove the file we're writing the imports to from that set
                var filesToInclude = grunt.file.expand([directory + '/**/_*.scss', '!' + filepath]);

                if (!quiet) {
                    grunt.log.writeln('\n' + filepath.yellow + ':');
                }

                if (!quiet && !filesToInclude.length) {
                    grunt.log.writeln('No files found in ' + directory.cyan + ' to import.');
                }

                filesToInclude.forEach(function (includeFilepath) {

                    // The include file is the filepath minus the directory slash and the
                    // initial underscore
                    var includeFile = includeFilepath.substring(includeFilepath.lastIndexOf('/') + 2);

                    // Remove .scss extension
                    includeFile = includeFile.replace('.scss', '');

                    if (!quiet) {
                        grunt.log.writeln('Importing ' + includeFile.cyan);
                    }

                    newFileContents.push('@import "' + includeFile + '";');
                });

                newFileContents = newFileContents.join('\n');
                grunt.file.write(filepath, newFileContents);
            });
        });

};
