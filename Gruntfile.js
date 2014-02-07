module.exports = function(grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    concat: {
      all: {
        files: {
          'dist/espy.js': [
            'src/espy.js'
          ]
        }
      }
    },
    karma: {
      all: {
        options: {
          browsers: ['PhantomJS'],
          files: [
            'src/espy.js',
            'tests/espy.js'
          ],
          frameworks: ['mocha', 'sinon-chai'],
          singleRun: true
        }
      }
    },
    uglify: {
      all: {
        files: {
          'dist/espy.min.js': 'dist/espy.js'
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
