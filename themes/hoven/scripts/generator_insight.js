const _ = require('lodash');
const util = require('hexo-util');

hexo.extend.generator.register('insight', function(locals) {

    function url_for(path) {
        return hexo.extend.helper.get('url_for').call(hexo, path);
    }
    
    function minify(str) {
        return util.stripHTML(str).trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    }

    function postMapper(post) {
        return {
            title: post.title,
            text: minify(post.content),
            link: url_for(post.path)
        }
    }
    function tagMapper() {
        return function (tag) {
            return {
                name: tag.name,
                slug: tag.slug,
                link: url_for(tag.path)
            }
        }
    }

    const site = {
        pages: locals.pages.map(postMapper),
        posts: locals.posts.map(postMapper),
        tags: locals.tags.map(tagMapper()),
        categories: locals.categories.map(tagMapper()),
    };

    return {
        path: 'content.json',
        data: JSON.stringify(site)
    };
});