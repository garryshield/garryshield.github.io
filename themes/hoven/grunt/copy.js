module.exports = function (grunt, options) {
  return {
    tasks: {
      copy: {
        fontawesome: {
          files: [{
            expand: true,
            cwd: 'node_modules/@fortawesome/fontawesome-free/',
            src: '{css,webfonts}/**',
            dest: dist_dir + '/ibs/fontawesome/',
          }]
        },
        img: {
          files: [{
            expand: true,
            cwd: src_dir,
            src: ['img/**/*'],
            dest: dist_dir,
          }]
        },
      }
    }
  }
}