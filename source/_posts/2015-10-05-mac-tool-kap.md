---
title: MacOS 开源的录屏工具 - Kap
subtitle: MacOS screen recorder tool
date: 2015-10-05 18:40:24
updated: 2015-10-05 18:40:24
categories:
 - MacOS
tags:
 - Gif
 - Kap
---

<p>
<img src="{% asset_path assets/logo.svg %}" width="200" />
</p>

[Kap][] 是一个开源的录屏工具，支持导出 GIF，MP4，WebM，APNG。同时可以自己编写插件用来分享，转化...
官网： [Kap][]
GitHub 网址： [Kap GitHub][]

<!--more-->

## 1. 安装
#### 1.1. 通过 brew 安装
{% codeblock lang:'bash' line_number:'true' %}
brew update
brew cask install kap
{% endcodeblock %}

#### 1.2. 直接下载安装
下载最新版本 [Kap Download][]
或者到 [Kap Releases][] 页面下载其它版本。

## 2. 使用
#### 2.1. 选择录制区域
启动后 Kap 会常驻在系统状态栏上。打开面板后看到一个红色按钮。点击它就可以在屏幕上进行录制区域的框选。

{% image assets/Snipaste_2018-07-21_19-04-35.png %}


框定的区域会用虚线标识出来，如果想要调整录制区域可以使用鼠标进行拖拽、拉伸来调整。

{% image assets/Snipaste_2018-07-21_19-08-48.png %}


要录制全屏或者指定窗口也可以直接选择。

{% image assets/Snipaste_2018-07-21_19-16-53.png %}


#### 2.2. 录制
选择录制区域后，再次点击红色按钮，等到系统状态栏上的 Kap 图标变成实心后就进入录制模式。

{% image assets/Snipaste_2018-07-21_19-25-56.png %}


要结束录制只需要再次点击系统状态栏上的 Kap 图标，Kap 将打开录制结果窗口。
通过下方的导航，可以导出不同的格式。如果录制结果不理想，关闭本窗口从新录制即可。

{% image assets/Snipaste_2018-07-21_19-44-53.png %}


## 3. 设置
通过快捷键「Command + ‘」进入设置界面。
常用的设置项目：
`Save To` 导出时存放目录
`Start automatically` 开机自动启动

`Show mouse cursor` 同时录制鼠标的移动
`Keyboard shortcut to record` 开启「Command + Shift + F5」快捷键

插件标签下按需求开启所需的插件，有兴趣按自己按[官方说明][Kap Plugin]自己扫插件

{% image assets/Snipaste_2018-07-21_19-48-31.png %}


## 4. 参考链接
· [Kap Screen Recorder][Kap Github]

[Kap]: https://getkap.co/
[Kap Github]: https://github.com/wulkano/kap
[Kap Download]: https://getkap.co/download
[Kap Releases]: https://github.com/wulkano/kap/releases
[Kap Plugin]: https://github.com/wulkano/kap/blob/master/docs/plugins.md