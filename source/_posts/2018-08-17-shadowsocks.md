---
title: Shadowsocks 安装及配置
subtitle: Install And Config Shadowsocks
date: 2018-08-17 21:07:07
updated: 2018-08-17 21:07:07
categories:
 - Python
tags:
 - Shadowsocks
---

## 1. 安装
使用 pip 安装。
{% codeblock lang:'bash' line_number:'true' %}
python --version
pip install shadowsocks
{% endcodeblock %}

## 2. 启动

#### 2.1. 方式一
直接启动。
{% codeblock lang:'bash' line_number:'true' %}
ssserver -p 8388 -k 123456 -m aes-256-cfb --log-file /root/shadowsocks.log --user nobody -d start
{% endcodeblock %}

<!--more-->

#### 2.1. 方式二
通过配置文件启动。
单用户：
{% codeblock /root/shadowsocks.json lang:'json' line_number:'true' %}
{
  "server":"0.0.0.0",
  "server_port":8388,
  "local_address": "127.0.0.1",
  "local_port":1080,
  "password":"123456",
  "timeout":300,
  "method":"aes-256-cfb",
  "fast_open": false
}
{% endcodeblock %}

多用户：
{% codeblock /root/shadowsocks.json lang:'json' line_number:'true' %}
{
  "server":"0.0.0.0",
  "local_address": "127.0.0.1",
  "local_port":1080,
  "port_password": {
    "8388":"123456",
    "8389":"123456",
  }
  "timeout":300,
  "method":"aes-256-cfb",
  "fast_open": false
}
{% endcodeblock %}

{% codeblock lang:'bash' line_number:'true' %}
ssserver -c /root/shadowsocks.json --log-file /root/shadowsocks.log --user nobody -d start
{% endcodeblock %}

`-d start` 启动。
`-d stop` 停止。
`-d restart` 重启。

__注：一般我们都需要运程访问 Shadowsocks 服务，因此需要设置防火墙开启相应端口。__

## 3. 优化
#### 3.1. 增加最大可打开文件描述符
`vi /etc/security/limits.conf`
添加如下：
{% codeblock lang:'bash' line_number:'true' %}
* soft nofile 51200
* hard nofile 51200
{% endcodeblock %}

启动前先运行 `ulimit -n 51200`。

#### 3.2. 优化内核参数
`vi /etc/sysctl.conf`
添加如下：
{% codeblock lang:'bash' line_number:'true' %}
fs.file-max = 51200

net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.core.netdev_max_backlog = 250000
net.core.somaxconn = 4096

net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 0
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.ip_local_port_range = 10000 65000
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_max_tw_buckets = 5000
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_mem = 25600 51200 102400
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_congestion_control = hybla
{% endcodeblock %}

运行 `sysctl -p` 使其生效。

## 4. 参考链接
· [Shadowsocks][]
· [Shadowsocks GitHub][]

[Shadowsocks]: http://shadowsocks.org/en/index.html
[Shadowsocks GitHub]: https://github.com/shadowsocks/shadowsocks/wiki