var fs = require('hexo-fs');
var pathFn = require('path');
var ejs = require('ejs');
var _ = require('lodash');

var template = `
<div class="gallery">
<div class="row gutters-5px justify-content-center">
    <% _.each(gallery.items, function(item, i) { %>
    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
    <a href="/<%= context.path + item.src %>" data-fancybox="<%= gallery.group %>" data-caption="<%- item.caption %>">
    <img class="img-fluid" src="/<%= context.path + item.src %>" />
    </a>
    </div>
    <% }) %>
</div>
</div>`;

hexo.extend.tag.register('gallery', function (args) {

  var context = this;
  // console.log(context);

  var filename = args[0];
  var path = pathFn.join(this.asset_dir, filename);

  return fs.readFile(path).then(function(content) {
    var html = '';
    var content = JSON.parse(content);

    if (content.items.length) {
      html = ejs.render(template, {
        gallery: content,
        context: context,
        _: _
      });
    }

    return html;
  }).catch(function(err) {
    console.log(err);
    return '';
  });
}, {
  async: true
});