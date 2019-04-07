---
title: Google 高级搜索
subtitle: Google 高级搜索
date: 2016-08-29 16:17:08
updated: 2016-08-29 16:17:08
categories:
 - Google
tags:
 - Google
---

双引号
关键词放在双引号中，代表完全匹配搜索，即返回的网页包含双引号中出现的所有的词，顺序也必须完全匹配。
例如：`"搜索 图片"`

减号
减号代表搜索不包含减号后面的词的网页。减号前面必须是空格，减号后面没有空格，紧跟着需要排除的词。
例如：`搜索 -引擎` 返回包含 `搜索` 不包含 `引擎` 的网页

星号
星号 `*` 通配符代表任何文字。
例如：`搜索*擎` 中的 `*` 号代表任何文字。返回包含 `搜索引擎`，`搜索收擎`，`搜索巨擎` 等内容的网页。

<!--more-->

inurl
`inurl:WORD` 搜索关键词出现在url中的网页。
例如：`inurl:引擎` 返回url中包含 `引擎` 的网页。
`inurl:admin.php`

allinurl 
`allinurl:WORDS` 搜索url中包含多个关键词的网页。
例如：`allinurl:搜索 引擎` 相当于：`inurl:搜索 inurl:引擎`。

intitle
`intitle:WORD` 返回title中包含关键词的网页。
例如：`intitle:用户登录` 返回title包含 `用户登录` 的网页

allintitle
`allintitle:WORDS` 返回title中包含多个关键词的网页。
例如：`allintitle:搜索 引擎` 相当于：`intitle:搜索 intitle:引擎`

intext
`intext:WORD` 返回正文中包含关键词的网页。
例如：`intext:用户登录` 返回正文包含 `用户登录` 的网页

allintext
`allintext:WORDS` 返回正文中包含多个关键词的网页。
例如：`allintext:搜索 引擎` 相当于：`intext:搜索 intext:引擎`

inanchor
`inanchor:WORD` 返回链接锚点中包含关键词的网页
例如：`inanchor:搜索` 返回链接锚点中包含 `搜索` 的网页。

allinanchor
`allinanchor:WORDS` 返回链接锚点中包含多个关键词的网页
例如：`allinanchor:搜索 引擎` 返回链接锚点中包含 `搜索` 和 `引擎` 的网页。

link
`link:URL` 返回链接到目标URL的网页

info
`info:URL` 返回目标URL信息

filetype
`filetype:TYPE WORD` 返回包含关键词的特定文件。
例如：`filetype:pdf 搜索` 返回包含 `搜索` 关键词的所有 `pdf` 文件。

site
`site:URL` 返回某个域名下的所有网页。
例如：`site:google.com`，`site:.google.com`

related
`related:URL` 返回与某个网站有关联的网页。

cache
`cache:URL` 返回某些已经被删除的死链接网页。

index of /
列出文件（需要服务器支持）
例如：`index of /mp3` 

[如何用好谷歌等搜索引擎？]: https://www.zhihu.com/question/20161362