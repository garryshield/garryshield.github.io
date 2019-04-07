module.exports = function (grunt, options) {
  return {
    tasks: {
      clean: {
        img: [
          dist_dir + 'img/'
        ],
      }
    }
  }
}