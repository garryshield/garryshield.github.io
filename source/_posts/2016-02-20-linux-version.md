---
title: 查看 Linux 内核版本和发行版信息
subtitle: View linux kernel version and distribution information
date: 2016-02-20 07:23:36
updated: 2016-02-20 07:23:36
categories:
 - Linux
tags:
 - Linux
---

Linux 有众多发行版，在编辑通用脚本等工作时通常需要检测：
- 内核版本 Kernel Version 
- 发行版信息 Distribution Information
- ...

来兼容它们。这里先挖个坑汇总一些基本命令和检测脚本，方便以后使用。

<!--more-->

## 1. 内核版本
{% codeblock lang:'bash' line_number:'true' %}
uname -a
// Linux localhost.localdomain 3.10.0-862.el7.x86_64 #1 SMP Fri Apr 20 16:44:24 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux

uname -r
// 3.10.0-862.el7.x86_64
{% endcodeblock %}

## 2. 发行版信息
发行版信息查看命令和具体的发行版本有关，可以通过如下方式依次判断：
#### 2.1. `/etc/*-release` 文件
CentOS7 为例
{% codeblock lang:'bash' line_number:'true' %}
ls /etc/ | grep 'release$'
// centos-release
// os-release
// redhat-release
// system-release

cat /etc/centos-release
// CentOS Linux release 7.5.1804 (Core)

cat /etc/os-release
// NAME="CentOS Linux"
// VERSION="7 (Core)"
// ID="centos"
// ID_LIKE="rhel fedora"
// VERSION_ID="7"
// PRETTY_NAME="CentOS Linux 7 (Core)"
// ANSI_COLOR="0;31"
// CPE_NAME="cpe:/o:centos:centos:7"
// HOME_URL="https://www.centos.org/"
// BUG_REPORT_URL="https://bugs.centos.org/"
// 
// CENTOS_MANTISBT_PROJECT="CentOS-7"
// CENTOS_MANTISBT_PROJECT_VERSION="7"
// REDHAT_SUPPORT_PRODUCT="centos"
// REDHAT_SUPPORT_PRODUCT_VERSION="7"
{% endcodeblock %}

<!--more-->

#### 2.2. `lsb_release` 命令
部分系统默认没有安装 lsb_release，要手动安装
{% codeblock lang:'bash' line_number:'true' %}
yum install -y redhat-lsb
lsb_release -a
// LSB Version:	:core-4.1-amd64:core-4.1-noarch:cxx-4.1-amd64:cxx-4.1-noarch:desktop-4.1-amd64:desktop-4.1-noarch:languages-4.1-amd64:languages-4.1-noarch:printing-4.1-amd64:printing-4.1-noarch
// Distributor ID:	CentOS
// Description:	CentOS Linux release 7.5.1804 (Core)
// Release:	7.5.1804
// Codename:	Core
{% endcodeblock %}

#### 2.3. `/proc/version` 文件
{% codeblock lang:'bash' line_number:'true' %}
cat /proc/version
// Linux version 3.10.0-862.el7.x86_64 (builder@kbuilder.dev.centos.org) (gcc version 4.8.5 20150623 (Red Hat 4.8.5-28) (GCC) ) #1 SMP Fri Apr 20 16:44:24 UTC 2018
{% endcodeblock %}

#### 2.4. `hostnamectl` 命令
部分发行版使用了 Systemd，可以 `hostnamectl` 命令查看查看当前主机的信息
{% codeblock lang:'bash' line_number:'true' %}
hostnamectl

//    Static hostname: localhost.localdomain
//          Icon name: computer-vm
//            Chassis: vm
//         Machine ID: 085c99725433460e9b2a00df4c364940
//            Boot ID: f6c3ff7f068d41b0b1aaded0a87bf70e
//     Virtualization: vmware
//   Operating System: CentOS Linux 7 (Core)
//        CPE OS Name: cpe:/o:centos:centos:7
//             Kernel: Linux 3.10.0-862.el7.x86_64
//       Architecture: x86-64
{% endcodeblock %}


## 3. 检测脚本
#### 3.1. sh
{% codeblock lang:'bash' line_number:'true' %}
#!/bin/sh
# Detects which OS and if it is Linux then it will detect which Linux Distribution.

OS=`uname -s`
REV=`uname -r`
MACH=`uname -m`

GetVersionFromFile()
{
	VERSION=`cat $1 | tr "\n" ' ' | sed s/.*VERSION.*=\ // `
}

if [ "${OS}" = "SunOS" ] ; then
	OS=Solaris
	ARCH=`uname -p`	
	OSSTR="${OS} ${REV}(${ARCH} `uname -v`)"
elif [ "${OS}" = "AIX" ] ; then
	OSSTR="${OS} `oslevel` (`oslevel -r`)"
elif [ "${OS}" = "Linux" ] ; then
	KERNEL=`uname -r`
	if [ -f /etc/redhat-release ] ; then
		DIST='RedHat'
		PSUEDONAME=`cat /etc/redhat-release | sed s/.*\(// | sed s/\)//`
		REV=`cat /etc/redhat-release | sed s/.*release\ // | sed s/\ .*//`
	elif [ -f /etc/SUSE-release ] ; then
		DIST=`cat /etc/SUSE-release | tr "\n" ' '| sed s/VERSION.*//`
		REV=`cat /etc/SUSE-release | tr "\n" ' ' | sed s/.*=\ //`
	elif [ -f /etc/mandrake-release ] ; then
		DIST='Mandrake'
		PSUEDONAME=`cat /etc/mandrake-release | sed s/.*\(// | sed s/\)//`
		REV=`cat /etc/mandrake-release | sed s/.*release\ // | sed s/\ .*//`
	elif [ -f /etc/debian_version ] ; then
		DIST="Debian `cat /etc/debian_version`"
		REV=""

	fi
	if [ -f /etc/UnitedLinux-release ] ; then
		DIST="${DIST}[`cat /etc/UnitedLinux-release | tr "\n" ' ' | sed s/VERSION.*//`]"
	fi
	
	OSSTR="${OS} ${DIST} ${REV}(${PSUEDONAME} ${KERNEL} ${MACH})"

fi


echo ${OSSTR}
{% endcodeblock %}

#### 3.2. python
{% codeblock lang:'bash' line_number:'true' %}
// python3
cd ~
wget https://raw.githubusercontent.com/python/cpython/master/Lib/platform.py
chmod +x platform.py
./platform.py
// Linux-4.9.87-linuxkit-aufs-x86_64-with-centos-7.5.1804-Core

// python2
cd ~
wget https://raw.githubusercontent.com/python/cpython/2.7/Lib/platform.py
chmod +x platform.py
./platform.py
// Linux-3.10.0-862.el7.x86_64-x86_64-with-centos-7.5.1804-Core
{% endcodeblock %}

## 4. 参考链接
· [Detecting Underlying Linux Distro][]

[Detecting Underlying Linux Distro]: https://www.novell.com/coolsolutions/feature/11251.html
