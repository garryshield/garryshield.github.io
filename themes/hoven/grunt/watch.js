module.exports = function (grunt, options) {
  return {
    tasks: {
      watch: {
        sass: {
          files: [src_dir + 'css/bootstrap/*.scss'],
          tasks: ['sass:bootstrap', 'concat:css', 'cssmin:libs'],
        },
        less: {
          files: [
            src_dir + 'css/**/*.less',
          ],
          tasks: ['less:main'],
        },
        uglify: {
          files: [src_dir + 'js/*.js'],
          tasks: ['uglify:main'],
        },
        img: {
          files: [src_dir + 'img/**/*'],
          tasks: ['clean:img', 'copy:img'],
        },
      }
    }
  }
}