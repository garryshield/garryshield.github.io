const ejs = require('ejs');
const _ = require('lodash');
const url = require('url');

var template = `
<p><a href="<%= src %>" data-fancybox="<%= group %>" data-caption="<%- caption %>">
<img src="<%= src %>"<%= klass ? ' class='+ klass : '' %><%= style ? ' style='+ style : '' %> />
</a></p>`;

hexo.extend.tag.register('image', function (args) {

  var context = this;
  // console.log(context);
  var PostAsset = hexo.model('PostAsset')

  var slug = args[0];
  var group = args[1] || context._id;
  var caption = args[2] || context.title;
  var klass = args[3] || 'border';
  var style = args[4] || '';

  const asset = PostAsset.findOne({post: context._id, slug});
  // console.log(asset);
  if (!asset) return;

  var src = url.resolve(hexo.config.root, asset.path);

  var html = ejs.render(template, {
    src: src,
    group: group,
    caption: caption,
    klass: klass,
    style: style,
    _: _
  });

  return html;
});