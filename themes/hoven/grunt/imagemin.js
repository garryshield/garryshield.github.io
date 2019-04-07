const fs = require('fs');
const path = require('path');

function bytesToSize(bytes, space) {
  space = space || '';
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0'+ space +'Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + space + sizes[i];
};

module.exports = function (grunt, options) {
  grunt.registerTask('post_assets_logs', '', function() {
    var done = this.async();

    var incr = 0;
    var max_incr = 5;
    var timer = setInterval(function(){
      incr++;
      if(incr > 2*max_incr){
        done()
        clearInterval(timer);
      }
    },1000);

    var src = grunt.file.expand({
      cwd: hexo_posts_dir
    }, [
      '*/_assets/*.{jpg,png,gif,svg}'
    ])

    var dest = grunt.file.expand({
      cwd: hexo_posts_dir
    }, [
      '*/assets/*.{jpg,png,gif,svg}'
    ])

    src.forEach((file, i) => {
      fs.stat(path.join(hexo_posts_dir, file), (err1, stats1) => {
        fs.stat(path.join(hexo_posts_dir, dest[i]), (err, stats) => {

          grunt.log.writeln(file);
          grunt.log.writeln('src size:', bytesToSize(stats1.size), 'dest size:', bytesToSize(stats.size), 'percent:', Math.floor((stats.size/stats1.size)*100)+'%');
          grunt.log.writeln();
          
          if(err == null){
            if(max_incr < incr)
              max_incr = incr;
            incr = 0;
          }
          return true;
        })

      })
    });
  })

  grunt.registerTask('post_assets', ['imagemin:post_assets', 'post_assets_logs'])

  return {
    tasks: {
      imagemin: {
        post_assets: {
          options: {
            optimizationLevel: 4,
          },
          files: [{
            expand: true,
            cwd: hexo_posts_dir,
            src: ['**/*.{jpg,png,gif,svg}'],
            dest: hexo_posts_dir,
            rename: function(dest, src) {
                var new_src = src.replace('/_assets/', '/assets/');

                var src = path.join(dest, src);
                var dest = path.join(dest, new_src);

                return dest;
            }
          }]
        },
      }
    }
  }
}