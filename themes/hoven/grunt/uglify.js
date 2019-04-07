module.exports = function (grunt, options) {
  return {
    tasks: {
      uglify: {
        options: {
          manage: false,
          preserveComments: 'all'
        },
        main: {
          files: [{
              src: [
                src_dir + 'js/main.js',
                src_dir + 'js/insight.js'
              ],
              dest: dist_dir + 'js/main.min.js'
            }]
        }
      }
    }
  }
}