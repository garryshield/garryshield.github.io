module.exports = function (grunt, options) {
  return {
    tasks: {
      sass: {
        bootstrap: {
          options: {
            sourcemap: 'none',
            loadPath: ['node_modules/bootstrap/scss/']
          },
          files: [{
            src: [src_dir + 'css/bootstrap/v1.bootstrap.scss'],
            dest: src_dir + 'css/bootstrap/v1.bootstrap.css'
          }]
        }
      }
    }
  }
}