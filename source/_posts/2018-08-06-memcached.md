---
title: CentOS7 下编译安装 Memcached 1.5 系列
subtitle: Compile Memcached 1.5 Series Under CentOS7
date: 2018-08-06 10:09:37
updated: 2018-08-06 10:09:37
categories:
 - CentOS
 - Memcached
tags:
 - Memcached
---

[Memcached][] 是一个高性能的分布式内存对象缓存系统，用于以减轻数据库负载。

## 1. 结构规划
{% codeblock lang:'bash' line_number:'false' %}
用户名 memcached
用户组 memcached
端口 2307

# 源码包
/root/tmp/memcached-1.5.9.tar.gz

# 解压后源码
/root/tmp/memcached-1.5.9

# 编译目录
/root/tmp/build

# 编译安装错误
/root/tmp/configure.err
/root/tmp/make.err
/root/tmp/install.err

# 安装目录
/usr/local/memcached-1.5.9

# 工作目录
/var/sites/memcached-1.5.9
  # 配置文件目录
  /etc
  # Systemd Unit File
  /systemd
{% endcodeblock %}

<!--more-->

## 2. 下载源码包
到 [官网下载][Memcached] 最新版。目前最新版本是 [memcached-1.5.9.tar.gz][]。
{% codeblock lang:'bash' line_number:'true' %}
cd /root/tmp/
wget -O ./memcached-1.5.9.tar.gz http://www.memcached.org/files/memcached-1.5.9.tar.gz
{% endcodeblock %}

## 3. 安装依赖
{% codeblock lang:'bash' line_number:'true' %}
for packages in libevent libevent-devel; do
  yum -y install $packages;
done;
{% endcodeblock %}

## 4. 添加用户和组
{% codeblock lang:'bash' line_number:'true' %}
groupadd memcached;
useradd -s /sbin/nologin -d /dev/null -M -g memcached memcached;
{% endcodeblock %}

## 5. 添加端口
添加运程访问端口 2307，Memcached 默认使用 11211
{% codeblock lang:'bash' line_number:'true' %}
firewall-cmd --permanent --zone=public --add-port=2307/tcp;
firewall-cmd --reload;
{% endcodeblock %}

## 6. 解包并编译
{% codeblock lang:'bash' line_number:'true' %}
cd /root/tmp/

tar -zxvf memcached-1.5.9.tar.gz  -C ./

cd memcached-1.5.9

./configure --help > ../option

# 编译并导出错误到 ../configure.err
./configure --prefix=/usr/local/memcached-1.5.9 2> ../configure.err

make -j 4 2> ../make.err

make -j 4 install 2> ../install.err
{% endcodeblock %}

## 7. 配置文件 memcached
编译安装后源码目录下 `scripts/memcached.sysconfig` 到 `/var/sites/memcached-1.5.9/etc/memcached`，关修改相应参数。
{% codeblock lang:'bash' line_number:'true' %}
mkdir -p /var/sites/memcached-1.5.9/etc/

cd /root/tmp/memcached-1.5.9
cp scripts/memcached.sysconfig /var/sites/memcached-1.5.9/etc/memcached
{% endcodeblock %}

{% codeblock memcached lang:'bash' line_number:'true' %}
cat /var/sites/memcached-1.5.9/etc/memcached | sed -e "s/#.*//g" | awk '{if (length !=0) print $0}'

USER="memcached"
MAXCONN="1024"
CACHESIZE="64"
OPTIONS=""
PORT="2307"
{% endcodeblock %}

## 8. Systemd Unit File
编译安装后需要用 Systemd 来管理 Memcached，默认的 Unit File 在编译目录下分别为 `scripts/memcached.service`、`scripts/memcached@.service`。其中 `memcached@.service` 用来启动多实例服务。分别复制到 `/var/sites/memcached-1.5.9/systemd` 目录并修改重命名为 `memcached-1.5.9.service`、`memcached-1.5.9@.service`，做相应修改后用如下命令启用。
{% codeblock lang:'bash' line_number:'true' %}
mkdir -p /var/sites/memcached-1.5.9/systemd/

cd /root/tmp/memcached-1.5.9
cp scripts/memcached.service /var/sites/memcached-1.5.9/systemd/memcached-1.5.9.service
cp scripts/memcached@.service /var/sites/memcached-1.5.9/systemd/memcached-1.5.9@.service
{% endcodeblock %}

{% codeblock lang:'bash' line_number:'true' %}
systemctl enable /var/sites/memcached-1.5.9/systemd/memcached-1.5.9.service
{% endcodeblock %}
注：这里并没有直接复制到默认的 Unit File 目录 `/etc/systemd/system` 下，而是直接通过 `systemctl enable` 机制创建相关的链接文件。这样的做的好处是所有的配置文件、启动脚集中在一个目录下方便管理。

{% codeblock memcached-1.5.9.service lang:'bash' line_number:'true' %}
cat /var/sites/memcached-1.5.9/systemd/memcached-1.5.9.service | sed -e "s/#.*//g" | awk '{if (length !=0) print $0}'

[Unit]
Description=memcached daemon
After=network.target
[Service]
EnvironmentFile=/var/sites/memcached-1.5.9/etc/memcached
ExecStart=/usr/local/memcached-1.5.9/bin/memcached -p ${PORT} -u ${USER} -m ${CACHESIZE} -c ${MAXCONN} $OPTIONS
PrivateTmp=true
ProtectSystem=full
NoNewPrivileges=true
PrivateDevices=true
CapabilityBoundingSet=CAP_SETGID CAP_SETUID CAP_SYS_RESOURCE
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
[Install]
WantedBy=multi-user.target
{% endcodeblock %}

## 9. 服务管理
{% codeblock lang:'bash' line_number:'true' %}
# 查看当前状态
systemctl status memcached-1.5.9

# 启动
systemctl start memcached-1.5.9

# 停止
systemctl stop memcached-1.5.9
{% endcodeblock %}

## 10. memcached-tool
源码包内置了一个 perl 写的 `scripts/memcached-tool` 管理脚本，可以用来查看 Memcached 的运行状态。
注：这个脚本并不会自动安装到安装目录中，因此要使用的话要手动复制过去
{% codeblock lang:'bash' line_number:'true' %}
cd /root/tmp/memcached-1.5.9
cp scripts/memcached-tool /usr/local/memcached-1.5.9/bin/memcached-tool
{% endcodeblock %}

{% codeblock lang:'bash' line_number:'true' %}
[root@localhost ~]# /usr/local/memcached-1.5.9/bin/memcached-tool 127.0.0.1:2320
 #  Item_Size  Max_age   Pages   Count   Full?  Evicted Evict_Time OOM
  1      96B     46771s       1       1      no        0        0    0
{% endcodeblock %}

[Memcached]: https://memcached.org/
[memcached-1.5.9.tar.gz]: http://www.memcached.org/files/memcached-1.5.9.tar.gz
