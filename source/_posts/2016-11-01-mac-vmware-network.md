---
title: MacOS VMware 网络设置
subtitle: MacOS VMware Network Setting
date: 2016-11-01 10:42:33
updated: 2016-11-01 10:42:33
categories:
 - VMware
 - MacOS
tags:
 - VMware
---

VMware 安装后主机上多了两个 VMnet1 和 VMnet8 虚拟网卡，由它们控制虚拟机与主机间的网络链接方式。

VMware 默认有三种链接方式:

__VMnet0 桥接网络__
虚拟机相当与网络上的一台独立计算机，与主机一样，拥有一个独立的 IP 地址。

__VMnet1 仅主机网络__
虚拟机只能和主机相互访问，不能访问外部网络。

__VMnet8 NAT网络__
虚拟机在外部网络上共享主机的 IP 地址，主机为虚拟机发出的网络流量进行网络地址转换。

<!--more-->

{% image assets/Snipaste_2018-08-01_10-53-10.png %}

## 1. 主机设置
主机通过 `ifconfig` 命令可以查看两个网卡的信息：
{% codeblock lang:'bash' line_number:'true' %}
vmnet1: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether 00:50:56:c0:00:01
	inet 172.16.233.1 netmask 0xffffff00 broadcast 172.16.233.255
vmnet8: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether 00:50:56:c0:00:08
	inet 192.168.113.1 netmask 0xffffff00 broadcast 192.168.113.255
{% endcodeblock %}

Windows 下可以通过界面修改网卡信息，但是 MacOS 下需要直接修改配置文件：
`/Library/Preferences/VMware\ Fusion/networking`

修改后需要执行 `vmnet-cli --configure` 再生成下列文件：
注意：直接修改下列文件没用。
`/Library/Preferences/VMware\ Fusion/vmnet1/dhcpd.conf`
`/Library/Preferences/VMware\ Fusion/vmnet8/dhcpd.conf`
`/Library/Preferences/VMware\ Fusion/vmnet8/nat.conf`

如下修改三种链接方式的 DHCP，网段等信息：
{% codeblock /Library/Preferences/VMware Fusion/networking lang:'bash' line_number:'true' %}
VERSION=1,0
answer VNET_1_DHCP yes
answer VNET_1_DHCP_CFG_HASH 3B1E88D9119434B209753913AF67F2B032B90DD0
answer VNET_1_HOSTONLY_NETMASK 255.255.255.0
answer VNET_1_HOSTONLY_SUBNET 172.16.233.0
answer VNET_1_VIRTUAL_ADAPTER yes
answer VNET_2_DHCP no
answer VNET_2_NAT no
answer VNET_2_NAT_PARAM_UDP_TIMEOUT 30
answer VNET_2_VIRTUAL_ADAPTER no
answer VNET_8_DHCP yes
answer VNET_8_DHCP_CFG_HASH ED961C19E7E96A10AFD637F8C28197AEA50C5C57
answer VNET_8_HOSTONLY_NETMASK 255.255.255.0
answer VNET_8_HOSTONLY_SUBNET 192.168.113.0
answer VNET_8_NAT yes
answer VNET_8_VIRTUAL_ADAPTER yes
{% endcodeblock %}

上面的设置表示：
VMnet8 子网为 `192.168.113.0`，并开启 DHCP，主机的 IP 默认为 `192.168.113.1`，网关和 DNS 默认为 `192.168.113.2`，
VMnet0 子网为 `172.16.233.0`，并开启 DHCP，主机的 IP 默认为 `172.16.233.1`，DNS 默认为 `172.16.233.2`，

保存修改后重启 VMware 即可生效，如果不想重启也可以使用 `vmnet-cli` 命令：
{% codeblock lang:'bash' line_number:'true' %}
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --configure
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --stop
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --start
{% endcodeblock %}

然后再次通过 `ifconfig` 确认下是否修改成功。

## 2. 虚拟机设置
以 VMware Fusion 10.1.2 安装 CentOS 7 64 为例，
#### 2.1. VMnet8 NAT网络
虚拟机在外部网络上共享主机的 IP 地址，主机为虚拟机发出的网络流量进行网络地址转换。

{% image assets/Snipaste_2018-08-01_13-06-47.png %}

修改虚拟机信息：
{% codeblock lang:'bash' line_number:'true' %}
// ens33 为网卡名
vi /etc/sysconfig/network-scripts/ifcfg-ens33
{% endcodeblock %}
{% codeblock lang:'bash' line_number:'true' %}
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none # dhcp 表示自动获取 IP，none：使用 IPADDR 设置静态 IP
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33 # 网卡名
UUID=28ad865d-5235-4454-9688-a1bce4637664
DEVICE=ens33
ONBOOT=yes # 开机启动
IPADDR=192.168.113.20 # IP
PREFIX=24
GATEWAY=192.168.113.2 # 网关
DNS1=192.168.113.2 # DNS
IPV6_PRIVACY=no
{% endcodeblock %}
建议固定 IP，这样不用每次在主机要链接虚拟机时还要先查看具体 IP。__注意使用固定 IP 时要和主机在同一网段。__

保存修改后重启网络服务：
CentOS 7 使用 Systemd 管理服务，更多关于 Systemd 的用法参见：{% post_link systemd 这篇文章 %}。
{% codeblock lang:'bash' line_number:'true' %}
// 重启网格
systemctl restart network
// or
service network restart

// 查看是否生效
ip addr
{% endcodeblock %}

最后检查主机，虚拟机，外网间是否能正常通讯：
{% codeblock lang:'bash' line_number:'true' %}
// 主机
ping 192.168.113.20

// 虚拟机
ping 192.168.113.1
ping baidu.com

// 主机尝试用 ssh 链接虚拟机
ssh root@192.168.113.20
{% endcodeblock %}

#### 2.2. VMnet0 桥接网络
虚拟机相当与网络上的一台独立计算机，与主机一样，拥有一个独立的IP地址。

{% image assets/Snipaste_2018-08-01_14-05-54.png %}

修改虚拟机信息：
注：我的主机 IP 是 `192.168.0.10`，网关是 `192.168.0.1`。
{% codeblock lang:'bash' line_number:'true' %}
// ens33 为网卡名
vi /etc/sysconfig/network-scripts/ifcfg-ens33
{% endcodeblock %}
{% codeblock lang:'bash' line_number:'true' %}
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=28ad865d-5235-4454-9688-a1bce4637664
DEVICE=ens33
ONBOOT=yes
IPADDR=192.168.0.20
PREFIX=24
GATEWAY=192.168.0.1
DNS1=192.168.0.1
IPV6_PRIVACY=no
{% endcodeblock %}

保存修改后参见上述 __VMnet8 NAT网络__ 的操作重启并检查。


#### 2.3. __VMnet1 仅主机网络__
虚拟机只能和主机相互访问，不能访问外部网络。

{% image assets/Snipaste_2018-08-01_14-17-47.png %}

修改虚拟机信息：
注：我的主机 IP 是 `192.168.0.10`，网关是 `192.168.0.1`。
{% codeblock lang:'bash' line_number:'true' %}
// ens33 为网卡名
vi /etc/sysconfig/network-scripts/ifcfg-ens33
{% endcodeblock %}
{% codeblock lang:'bash' line_number:'true' %}
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=28ad865d-5235-4454-9688-a1bce4637664
DEVICE=ens33
ONBOOT=yes
IPADDR=172.16.233.20
PREFIX=24
GATEWAY=172.16.233.1
DNS1=172.16.233.1
IPV6_PRIVACY=no
{% endcodeblock %}

保存修改后参见上述 __VMnet8 NAT网络__ 的操作重启并检查。
注：此链接方式下只能主机与虚拟机通讯，不能与外网通讯。


## 3. 参考链接
· [VMware Documentation][]
· [Modifying the DHCP settings of vmnet1 and vmnet8 in Fusion][]
· [Understanding networking types in VMware Fusion][]
· [Red Hat Enterprise Linux 7 Document][]
· [Red Hat Enterprise Linux 7 Networking Guide][]


[Red Hat Enterprise Linux 7 Document]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/
[Red Hat Enterprise Linux 7 Networking Guide]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/networking_guide/
[VMware Documentation]: https://www.vmware.com/support/pubs/
[Understanding networking types in VMware Fusion]: https://kb.vmware.com/s/article/1022264
[Modifying the DHCP settings of vmnet1 and vmnet8 in Fusion]: https://kb.vmware.com/s/article/1026510