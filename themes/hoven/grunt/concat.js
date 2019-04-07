module.exports = function (grunt, options) {
  return {
    tasks: {
      concat: {
        css: {
          files: [{
            src: [
              src_dir + 'css/bootstrap/v1.bootstrap.css',
              // 'node_modules/highlightjs/styles/github.css',
              'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css',
              // tmp_dir + 'bootstrap-anchor/dist/css/bootstrap-anchor.min.css',
            ],
            dest: dist_dir + 'css/libs.min.css'
          }]
        },
        js: {
          files: [{
            src: [
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/popper.js/dist/umd/popper.min.js',
              'node_modules/bootstrap/dist/js/bootstrap.min.js',
              // 'node_modules/highlightjs/highlight.pack.min.js',
              // 'node_modules/lightbox2/dist/js/lightbox.min.js',
              'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
              // tmp_dir + '/bootstrap-anchor/dist/js/bootstrap-anchor.min.js',
            ],
            dest: dist_dir + 'js/libs.min.js'
          }]
        }
      }
    }
  }
}