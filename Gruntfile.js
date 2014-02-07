module.exports = function(grunt) {

  'use strict';

  var host = grunt.option('host') || 'localhost';

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    concat: {
      all: {
        files: {
          'dist/skate.js': [
            'src/skate.js'
          ]
        }
      }
    },
    karma: {
      all: {
        options: {
          browsers: ['PhantomJS'],
          files: [
            'dist/skate.js',
            'tests/skate.js'
          ],
          frameworks: ['mocha', 'sinon-chai'],
          singleRun: true
        }
      }
    },
    uglify: {
      all: {
        files: {
          'dist/skate.min.js': 'dist/skate.js'
        }
      }
    },
    watch: {
      test: {
        files: ['src/*.js'],
        tasks: ['dist']
      }
    }
  });

  grunt.registerTask('build', 'Runs the tests and builds the dist.', ['test']);
  grunt.registerTask('dist', 'Builds the dist.', ['concat', 'uglify']);
  grunt.registerTask('test', 'Runs the tests.', ['dist', 'karma']);

};
