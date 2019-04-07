module.exports = function (grunt, options) {
  return {
    tasks: {
      cssmin: {
        libs: {
          files: [{
            src: dist_dir + 'css/libs.min.css',
            dest: dist_dir + 'css/libs.min.css'
          }]
        }
      }
    }
  }
}