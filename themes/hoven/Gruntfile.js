module.exports = function (grunt) {

  tmp_dir = 'source/_tmp/';
  src_dir = 'source/_assets/';
  dist_dir = 'source/assets/';

  hexo_dir = '../../';
  hexo_posts_dir = hexo_dir + 'source/_posts/';

  var options = {
    scope: ['devDependencies', 'dependencies']
  };
  require('load-grunt-tasks')(grunt, options);

  var options = {
    config: {
      src: 'grunt/*.js'
    },
    pkg: grunt.file.readJSON('package.json'),
  };
  var configs = require('load-grunt-configs')(grunt, options);

  grunt.initConfig(configs);

  grunt.registerTask('default', ['sass', 'less', 'uglify', 'copy', 'concat', 'cssmin', 'watch']);

};