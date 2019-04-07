---
title: 使用 Electron 构建跨平台桌面应用
subtitle: User Electronjs Create Cross Platform Desktop App
date: 2018-08-10 13:08:43
updated: 2018-08-10 13:08:43
categories:
 - Node.js
tags:
 - Electron
---

<p>
<img src="{% asset_path assets/logo.svg %}" width="400" />
</p>

[Electron][] 最早由 Github 开发用于构建文本编辑器 Atom，通过整合 Chromium 和 Node.js 能够直接使用 HTML，CSS，JavaScript 进行开发。

## 1. 应用结构
[Electron][] 基于 Node.js ，安装之前先确保系统已经安装好 Node.js。
{% codeblock lang:'bash' line_number:'true' %}
cd ~/Node.js/electron
mkdir 01 && cd 01
npm init
npm install --save-dev electron # 安装 electron
touch main.js # 主进程文件
touch index.html # 页面文件
{% endcodeblock %}

<!--more-->

一个最基本的 Electron 应用目录结构如下：
{% codeblock lang:'bash' line_number:'true' %}
.
├── index.html
├── main.js
├── node_modules
├── package-lock.json
└── package.json

1 directory, 4 files
{% endcodeblock %}

修改 `package.json` 文件如下：
{% codeblock lang:'js' line_number:'true' %}
{
  "name": "01",
  "version": "1.0.0",
  "description": "",
  "main": "main.js", // 指向 main.js
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "electron ." // 启动命令
  },
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {
    "electron": "^2.0.7"
  }
}
{% endcodeblock %}

## 2. main.js
Electron 通过执行 `main.js` 创建主进程。

{% codeblock lang:'js' line_number:'true' %}
// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
{% endcodeblock %}

## 3. index.html
主进程通过 `win.loadFile('index.html')` 加载渲染页面。

{% codeblock lang:'html' line_number:'true' %}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <!-- All of the Node.js APIs are available in this renderer process. -->
    We are using Node.js <script>document.write(process.versions.node)</script>,
    Chromium <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
  </body>
</html>
{% endcodeblock %}

## 4. 启动
在创建并初始化完成 `main.js`、 `index.html` 和 `package.json` 之后，您就可以在当前工程的根目录执行 `npm start` 命令来启动刚刚编写好的 Electron 程序了。
{% codeblock lang:'bash' line_number:'true' %}
npm start
{% endcodeblock %}

{% image assets/Snipaste_2018-08-10_14-04-47.png %}


## 5. 打包
使用 [electron-builder][] 打包应用。

#### 5.1. 安装
{% codeblock lang:'bash' line_number:'true' %}
npm install --save-dev electron-builder
{% endcodeblock %}

#### 5.2. 配置
1、确认 `package.json` 中的 `name`, `description`, `version` 和 `author` 字段。

2、在 `package.json` 中添加 `build` 属性
{% codeblock package.json lang:'bash' line_number:'true' %}
  // ...
  "build": {
    "productName": "helloworld",
    "appId": "com.electrom.helloworld",
    "directories": {
      "output": "build" // 打包到 build 目录
    },
    "files": [
      "./**/*"
    ],
    // MacOS DMG
    "dmg": {
      "contents": [
        {
          "x": 410,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        },
        {
          "x": 130,
          "y": 150,
          "type": "file"
        }
      ]
    },
    // MacOS 
    "mac": {
      "icon": "build/icons/icon.icns"
    },
    // Windows
    "win": {
      "icon": "build/icons/icon.ico"
    },
    // Linux
    "linux": {
      "icon": "build/icons"
    }
  }
  // ...
{% endcodeblock %}

3、应用图标
{% codeblock lang:'bash' line_number:'true' %}
build/icons/
├── 256x256.png
├── icon.icns
└── icon.ico

0 directories, 3 files
{% endcodeblock %}

4、打包指令
{% codeblock package.json lang:'bash' line_number:'true' %}
  // ...
  "scripts": {
    // ...
    // -mwl 同时打包 MacOS，Windows，Linux
    "build:dir": "electron-builder -mwl --dir",
    "build": "electron-builder -mwl"
  },
  // ...
{% endcodeblock %}

#### 5.3. 打包
{% codeblock lang:'bash' line_number:'true' %}
npm run build
{% endcodeblock %}

打包后文件
{% codeblock lang:'bash' line_number:'true' %}
build/
├── builder-effective-config.yaml
├── helloworld\ Setup\ 1.0.0.exe
├── helloworld\ Setup\ 1.0.0.exe.blockmap
├── helloworld-1.0.0-mac.zip
├── helloworld-1.0.0-x86_64.AppImage
├── helloworld-1.0.0.dmg
├── helloworld-1.0.0.dmg.blockmap
├── helloworld_1.0.0_amd64.snap
├── icons
├── linux-unpacked
├── mac
└── win-unpacked

4 directories, 8 files
{% endcodeblock %}

## 6. 参考链接
· [Electron][]
· [electron-builder][]

[Electron]: https://electronjs.org/
[electron-builder]: https://www.electron.build/