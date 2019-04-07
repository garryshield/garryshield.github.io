---
title: Linux 命令 - tree
subtitle: Linux command tree 
date: 2015-08-24 15:32:28
updated: 2015-08-24 15:32:28
categories:
 - Linux
tags:
 - Tree
---

Linux tree 命令用于以树状图列出目录的内容。

执行 `tree` 指令，它会列出指定目录下的所有文件，包括子目录里的文件。

## 1. 常用
{% codeblock lang:bash %}
-a              所有文件包括隐藏文件
-d              只显示目录
-L level        只显示第几级
-P pattern      只显示匹配的文件
-I pattern      不显示匹配的文件
-o filename     输出到文件，而不是 stdout             
{% endcodeblock %}

## 2. 实例
#### 2.1. 层级
{% codeblock lang:bash %}
// 列出目录 ./ 第一级文件名
tree -L 1 ./
{% endcodeblock %}

{% codeblock lang:bash line_number:false %}
./
├── _config.yml
├── node_modules
├── package-lock.json
├── package.json
├── scaffolds
├── source
└── themes

4 directories, 3 files
{% endcodeblock %}

<!--more-->


#### 2.2. 过滤
{% codeblock lang:bash %}
// 列出目录 ./ 第一级下【后缀为 .json 的文件和目录】及【其它】
tree -P '*.json' -L 1 ./
{% endcodeblock %}

{% codeblock lang:bash line_number:false %}
// _config.yml 文件被过滤
./
├── node_modules
├── package-lock.json
├── package.json
├── scaffolds
├── source
└── themes

4 directories, 2 files
{% endcodeblock %}

#### 2.3. 筛选
{% codeblock lang:bash %}
// 列出目录 ./ 第一级下除了 node_modules 的文件
tree -I 'node_modules' -L 1 ./
{% endcodeblock %}

{% codeblock lang:bash line_number:false %}
// node_modules 目录被过滤
./
├── _config.yml
├── package-lock.json
├── package.json
├── scaffolds
├── source
└── themes

3 directories, 3 files
{% endcodeblock %}

## 3. 语法
{% codeblock lang:'javascript' line_number:'false' %}
usage: tree [-acdfghilnpqrstuvxACDFJQNSUX] [-H baseHREF] [-T title ]
	[-L level [-R]] [-P pattern] [-I pattern] [-o filename] [--version]
	[--help] [--inodes] [--device] [--noreport] [--nolinks] [--dirsfirst]
	[--charset charset] [--filelimit[=]#] [--si] [--timefmt[=]<f>]
	[--sort[=]<name>] [--matchdirs] [--ignore-case] [--] [<directory list>]
  ------- Listing options -------
  -a            All files are listed.
  -d            List directories only.
  -l            Follow symbolic links like directories.
  -f            Print the full path prefix for each file.
  -x            Stay on current filesystem only.
  -L level      Descend only level directories deep.
  -R            Rerun tree when max dir level reached.
  -P pattern    List only those files that match the pattern given.
  -I pattern    Do not list files that match the given pattern.
  --ignore-case Ignore case when pattern matching.
  --matchdirs   Include directory names in -P pattern matching.
  --noreport    Turn off file/directory count at end of tree listing.
  --charset X   Use charset X for terminal/HTML and indentation line output.
  --filelimit # Do not descend dirs with more than # files in them.
  --timefmt <f> Print and format time according to the format <f>.
  -o filename   Output to file instead of stdout.
  -------- File options ---------
  -q            Print non-printable characters as '?'.
  -N            Print non-printable characters as is.
  -Q            Quote filenames with double quotes.
  -p            Print the protections for each file.
  -u            Displays file owner or UID number.
  -g            Displays file group owner or GID number.
  -s            Print the size in bytes of each file.
  -h            Print the size in a more human readable way.
  --si          Like -h, but use in SI units (powers of 1000).
  -D            Print the date of last modification or (-c) status change.
  -F            Appends '/', '=', '*', '@', '|' or '>' as per ls -F.
  --inodes      Print inode number of each file.
  --device      Print device ID number to which each file belongs.
  ------- Sorting options -------
  -v            Sort files alphanumerically by version.
  -t            Sort files by last modification time.
  -c            Sort files by last status change time.
  -U            Leave files unsorted.
  -r            Reverse the order of the sort.
  --dirsfirst   List directories before files (-U disables).
  --sort X      Select sort: name,version,size,mtime,ctime.
  ------- Graphics options ------
  -i            Don't print indentation lines.
  -A            Print ANSI lines graphic indentation lines.
  -S            Print with CP437 (console) graphics indentation lines.
  -n            Turn colorization off always (-C overrides).
  -C            Turn colorization on always.
  ------- XML/HTML/JSON options -------
  -X            Prints out an XML representation of the tree.
  -J            Prints out an JSON representation of the tree.
  -H baseHREF   Prints out HTML format with baseHREF as top directory.
  -T string     Replace the default HTML title and H1 header with string.
  --nolinks     Turn off hyperlinks in HTML output.
  ---- Miscellaneous options ----
  --version     Print version and exit.
  --help        Print usage and this help message and exit.
  --            Options processing terminator.
{% endcodeblock %}