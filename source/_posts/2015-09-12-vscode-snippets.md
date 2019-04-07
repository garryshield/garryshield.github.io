---
title: VS Code 创建代码片段
subtitle: Creating your own snippets with VS Code
date: 2015-09-12 22:01:12
updated: 2015-09-12 22:01:12
categories:
 - VS Code
tags:
 - VS Code
---

Snippet 即代码段，指的是能够帮助输入重复代码模式，比如循环或条件语句的模板。

通过 Snippet 我们仅仅输入一小段字符串「prefix」，就可以在代码段引擎的帮助下，生成预定义的模板代码，接着我们还可以通过在预定义的光标位置之间跳转，来快速补全模板。

当然，看图更易懂。下图将 aja 补全为 JQuery 的 ajax() 方法，并通过光标的跳转，快速补全了待填键值对：

{% image assets/Kapture_2018-07-20_at_22.57.09.gif %}


<!--more-->

## 1. Snippet 配置流程
进入 Snippet 设置文件，这里提供了三种方法： 
1. 通过快捷键「Shift + Command + P」打开命令窗口（All Command Window），输入<kbd>snippet</kbd>，点选「首选项：配置用户代码段片段」。
2. 点击界面最左侧竖栏（也即活动栏）最下方的齿轮按钮，在弹出来的菜单中点选「用户代码片段」。
3. 下「Alt」键切换菜单栏，通过文件 > 首选项 > 用户代码片段。

## 2. Snippet 详细介绍
设置文件头部的一个块注释给出了设置 Snippet 的格式

{% codeblock lang:'json' line_number:'true' %}
{
  "Print to console": {
    "prefix": "log",
    "body": [
      "console.log('$1');",
      "$2"
    ],
    "description": "Log output to console"
  },
  ...
}
{% endcodeblock %}

Snippet 由三部分组成：
1. prefix：前缀，定义了 Snippet 关键字;
2. body： 主体，即模板的主体内容，其中每个字符串表示一行;
3. description：说明，候选栏中出现。未定义的情况下直接显示对象名，上例中将会显示 Print to console。


#### 2.1. Snippet 主体
主体部分可以使用特殊语法结构，来控制光标和要插入的文本。支持的基本结构如下：

##### 2.1.1. Tabstops：制表符
「Tabstops」可以让编辑器的指针在 Snippet 内跳转。
使用 `$1`，`$2` 等指定光标位置。这些数字指定了光标跳转的顺序。
`$0` 表示最终光标位置。相同序号的「Tabstops」被链接在一起，将会同步更新

##### 2.1.2. Placeholders：占位符
「Placeholder」是带有默认值的「Tabstops」。
如 `${1:Placeholder}`。「placeholder」文本将被插入「Tabstops」位置，并在跳转时被全选，以方便修改。

##### 2.1.3. Choice：可选项
「Choice」是提供可选值的「Placeholder」。
语法为一系列用逗号隔开，并最终被两个竖线圈起来的枚举值，
比如 `${1|one,two,three|}`。当光标跳转到该位置的时候，用户将会被提供多个值 [`one`, `two`, `three`] 以供选择。

##### 2.1.4. Variables：变量
使用 `$name` 或 `${name:Placeholder}` 可以插入变量的值。
当变量未赋值时，将插入其缺省值或空字符串。 
当变量未知时，将插入变量的名称，并将其转换为「Placeholder」。

文件&内容相关变量：

`TM_SELECTED_TEXT    ` 选中的文本
`TM_CURRENT_LINE     ` 行内容
`TM_CURRENT_WORD     ` 光标所在的单词
`TM_LINE_INDEX       ` 行号（0为基）
`TM_LINE_NUMBER      ` 行号（1为基）    
`TM_FILENAME         ` 文件名         
`TM_FILENAME_BASE    ` 文件名无后缀
`TM_DIRECTORY        ` 文件所在目录
`TM_FILEPATH         ` 文件路径
`CLIPBOARD           ` 剪贴板内容

时间相关的变量：
`CURRENT_YEAR              ` 年
`CURRENT_YEAR_SHORT        ` 年（两位）
`CURRENT_MONTH             ` 月（两位），如 02；
`CURRENT_MONTH_NAME        ` 月份的全称，如 July；
`CURRENT_MONTH_NAME_SHORT  ` 月份的简称，如 Jul；
`CURRENT_DATE              ` 月份第几天
`CURRENT_DAY_NAME          ` 周，如 Monday；
`CURRENT_DAY_NAME_SHORT    ` 周简称，如 Mon；
`CURRENT_HOUR              ` 时
`CURRENT_MINUTE            ` 分
`CURRENT_SECOND            ` 秒

## 3. 参考链接
· [VS Code](https://code.visualstudio.com/)
· [Creating your own snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
