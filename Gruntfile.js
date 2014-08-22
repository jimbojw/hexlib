'use strict';
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    clean: ['dist'],
    
    concat: {
      dist: {
        src: [
          'src/hex.intro.js',
          'src/hex.core.js',
          'src/hex.element.js',
          'src/hex.event.js',
          'src/hex.grid.js',
          'src/hex.grid.hexagonal.js',
          'src/hex.grid.hexagonal-horizontal.js',
          'src/hex.grid.rectangular.js',
          'src/hex.grid.skew.js',
          'src/hex.grid.triangular.js',
          'src/hex.region.js',
          'src/hex.sprite.js',
          'src/hex.outro.js'
        ],
        dest: 'dist/hex.js'
      }
    },
    
    uglify: {
      dist: {
        src: 'dist/hex.js',
        dest: 'dist/hex.min.js'
      }
    }
    
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean', 'concat', 'uglify']);

};
