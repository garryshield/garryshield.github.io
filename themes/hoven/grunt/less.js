module.exports = function (grunt, options) {
  return {
    tasks: {
      less: {
        options: {
          paths: function (filepath) {
            return [
              src_dir + 'css'
            ];
          },
          compress: true,
          cleancss: true,
        },
        main: {
          files: [{
            src: src_dir + 'css/404.less',
            dest: dist_dir + 'css/404.min.css'
          }, {
            src: [
              src_dir + 'css/main.less',
              src_dir + 'css/insight.less',
              src_dir + 'css/highlightjs/github.less'
            ],
            dest: dist_dir + 'css/main.min.css'
          }]
        }
      }
    }
  }
}