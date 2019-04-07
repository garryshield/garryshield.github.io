---
title: 使用 Markdown-it 渲染 Hexo
subtitle: Uses Markdown-it as a render engine on Hexo
date: 2016-06-25 07:23:36
updated: 2016-06-25 07:23:36
categories:
 - Node.js
tags:
 - Hexo
 - Markdown
 - Emoji
---

Hexo 默认其官方插件 [hexo-renderer-marked][] 使用 [marked][] 来渲染 Markdown。这个插件有很多特殊 Markdown 语法不支持。

一番查找后发现 Hexo 官方还有另一个使用 [markdown-it][] 做渲染器的插件 [hexo-renderer-markdown-it][]。该渲染器有众多插件可以用来处理诸如：

- 缩写 [markdown-it-abbr][]
- 脚注 [markdown-it-footnote][]
- &lt;ins&gt; [markdown-it-ins][]
- 下标 [markdown-it-sub][]
- 上标 [markdown-it-sup][]
- 锚点 [markdown-it-anchor][]
- &lt;dl&gt; [markdown-it-deflist][]
- &lt;mark&gt; [markdown-it-mark][]
- 自定义容器 [markdown-it-container][]
- 表情 [markdown-it-emoji][]
- HTML 属性 [markdown-it-attrs][]
- Task Lists [markdown-it-task-lists][]
- [其它...](https://www.npmjs.com/search?q=keywords:markdown-it)

<!--more-->

## 1. 安装
进入你的 hexo 的根目录，先删除默认渲染器插件，再安装 [hexo-renderer-markdown-it][]
{% codeblock lang:'bash' line_number:'true' %}
cd myhexoblog/
npm uninstall hexo-renderer-marked

# npm install --save hexo-renderer-markdown-it
# 直接从 GitHub 上安装，支持配置插件
npm install --save git+https://github.com/hexojs/hexo-renderer-markdown-it.git
{% endcodeblock %}

## 2. 配置
{% codeblock _config.yml lang:'yaml' line_number:'true' %}

# Markdown-it config
## Docs: https://github.com/celsomiranda/hexo-renderer-markdown-it/wiki
markdown:
  render:
    # Enable HTML tags in source
    html: true

    # Use '/' to close single tags (<br />). This is only for full CommonMark compatibility.
    xhtmlOut: true        

    # Convert '\n' in paragraphs into <br> 
    breaks: true      

    # CSS language prefix for fenced blocks. Can be useful for external highlighters.
    langPrefix: 'language-'  

    # Autoconvert URL-like text to links 
    linkify: true        

    # Enable some language-neutral replacement + quotes beautification
    typographer: false

    # Double + single quotes replacement pairs, when typographer enabled,
    # and smartquotes on. Could be either a String or an Array.
    #
    # For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    # and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’'

  # Plugins
  plugins:
    - markdown-it-abbr
    - markdown-it-footnote
    - markdown-it-ins
    - markdown-it-sub
    - markdown-it-sup
    - markdown-it-anchor
    - markdown-it-deflist
    - markdown-it-mark
    - markdown-it-container

    - markdown-it-emoji
    - markdown-it-attrs
    - name: markdown-it-task-lists
      options:
        enabled: false
        label: true
        labelAfter: false
  
  # Automatic Headline ID's
  anchors:
    # Minimum level for ID creation. (Ex. h2 to h6)
    level: 2

    # A suffix that is prepended to the number given if the ID is repeated.
    collisionSuffix: 'v'           

    # If `true`, creates an anchor tag with a permalink besides the heading.
    permalink: false              

    # Class used for the permalink anchor tag.
    permalinkClass: header-anchor 

    # The symbol used to make the permalink
    permalinkSymbol: ¶
{% endcodeblock %}

## 3. 安装插件
{% codeblock lang:'bash' line_number:'true' %}
npm install --save markdown-it-abbr
npm install --save markdown-it-footnote
npm install --save markdown-it-ins
npm install --save markdown-it-sub
npm install --save markdown-it-sup
npm install --save markdown-it-anchor
npm install --save markdown-it-deflist
npm install --save markdown-it-mark
npm install --save markdown-it-container

npm install --save markdown-it-emoji
npm install --save markdown-it-attrs
npm install --save markdown-it-task-lists
{% endcodeblock %}

至此我们已经安装并配置好新的渲染器，运行如下命令使其生效：
{% codeblock lang:'bash' line_number:'true' %}
hexo clean
hexo server -p 4000
{% endcodeblock %}

## 4. Task List
[markdown-it-task-lists][] 用来渲染 GitHub 风格的 [Task List][]。
{% codeblock lang:'yaml' line_number:'true' %}
...
- name: markdown-it-task-lists
  options:
    enabled: false
    label: true
    labelAfter: false
...
{% endcodeblock %}

{% codeblock lang:'markdown' line_number:'true' %}
__Task List__
- [ ] Mercury
- [x] Venus
- [x] Earth (Orbit/Moon)
- [x] Mars
- [ ] Jupiter
- [ ] Saturn
- [ ] Uranus
- [ ] Neptune
- [ ] Comet Haley
{% endcodeblock %}

__Task List__
- [ ] Mercury
- [x] Venus
- [x] Earth (Orbit/Moon)
- [x] Mars
- [ ] Jupiter
- [ ] Saturn
- [ ] Uranus
- [ ] Neptune
- [ ] Comet Haley

## 5. 表情 Emoji
#### 5.1. EmojiCopy
在 [EmojiCopy][] 中找到你想要的表情，然后点击即可复制粘贴。

😦 😊 😕

#### 5.2. Emoji Cheat Sheet
参见 [markdown-it-emoji definitions][]。
{% codeblock lang:'markdown' line_number:'true' %}
:frowning: :blush: :confused:
{% endcodeblock %}

:frowning: :blush: :confused:

#### 5.3. 缩写格式（shortcuts）
参见 [markdown-it-emoji shortcuts][]。
{% codeblock lang:'markdown' line_number:'true' %}
>:( :") :/
{% endcodeblock %}

>:( :") :/

注：上述三种方式同时可以结合 [markdown-it-attrs][] 插件添加 style 或者 classname 修改表情大小。
{% codeblock lang:'markdown' line_number:'true' %}
😦 😊 😕
{style="font-size:2rem;"}

😦 😊 😕
{.h2}

:frowning: :blush: :confused:
{.h2}

>:( :") :/
{.h2}
{% endcodeblock %}

#### 5.4. Twemoji
上述三种方式都是输出 Unicode 字符表情，通过 [Twemoji][] 可以输出图片格式的表情。
实际上 [markdown-it-attrs][] 可以通过 `md.renderer.rules.emoji` 来设置渲染输出处理机制，默认是直接输出。只需要修改这个地方就能满足要求。
首先需要安装 twemoji 包：
{% codeblock lang:'bash' line_number:'true' %}
npm install --save twemoji
{% endcodeblock %}

然后修改如下代码：
{% codeblock node_modules/markdown-it-emoji/index.js lang:'javascript' line_number:'true' %}
...
var twemoji = require('twemoji')
 
// md.renderer.rules.emoji = emoji_html;
md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content, {
    // options
    // https://github.com/twitter/twemoji
  });
};
...
{% endcodeblock %}

[Twemoji][] 可以输出 svg 格式的图片，要修改表情图片的大小，只能在 Css 中修改。
{% codeblock lang:'css' line_number:'true' %}
.emoji {
  height: 1.5em;
  width: 1.5em;
  margin: 0 .05em 0 .1em;
  vertical-align: -0.1em;
}
{% endcodeblock %}


## 6. 参考链接
· [hexo-renderer-marked][]
· [hexo-renderer-markdown-it][]
· [Emoji Cheat Sheet][]
· [Github Emojis API][]
· [Twemoji][]
· [EmojiCopy][]

[hexo-renderer-marked]: https://github.com/hexojs/hexo-renderer-marked
[marked]: https://github.com/markedjs/marked

[hexo-renderer-markdown-it]: https://github.com/hexojs/hexo-renderer-markdown-it
[markdown-it]: https://github.com/markdown-it/markdown-it

[markdown-it-abbr]: https://www.npmjs.com/package/markdown-it-abbr
[markdown-it-footnote]: https://www.npmjs.com/package/markdown-it-footnote
[markdown-it-ins]: https://www.npmjs.com/package/markdown-it-ins
[markdown-it-sub]: https://www.npmjs.com/package/markdown-it-sub
[markdown-it-sup]: https://www.npmjs.com/package/markdown-it-sup
[markdown-it-anchor]: https://www.npmjs.com/package/markdown-it-anchor
[markdown-it-emoji]: https://www.npmjs.com/package/markdown-it-emoji
[markdown-it-task-lists]: https://www.npmjs.com/package/markdown-it-task-lists
[markdown-it-attrs]: https://www.npmjs.com/package/markdown-it-attrs
[markdown-it-deflist]: https://www.npmjs.com/package/markdown-it-deflist
[markdown-it-mark]: https://www.npmjs.com/package/markdown-it-mark
[markdown-it-container]: https://www.npmjs.com/package/markdown-it-container

[Task List]: https://blog.github.com/2014-04-28-task-lists-in-all-markdown-documents/

[Emoji Cheat Sheet]: https://www.webpagefx.com/tools/emoji-cheat-sheet/
[Github Emojis API]: https://api.github.com/emojis
[Twemoji]: https://twemoji.twitter.com/
[EmojiCopy]: https://www.emojicopy.com/

[markdown-it-emoji shortcuts]: https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/shortcuts.js
[markdown-it-emoji definitions]: https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json