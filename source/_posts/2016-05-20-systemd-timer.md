---
title: Systemd 定时器单元 - Timer
subtitle: Systemd Timer Unit
date: 2016-05-20 07:23:36
updated: 2016-05-20 07:23:36
categories:
 - Linux
tags:
 - Systemd
---

Timers 是以 .timer 为后缀名的 systemd 单元文件，用于控制 .service 文件或事件。Timers 可用来代替 cron。Timers 内置了日历定时事件和单调定时事件的支持，并可以异步执行这些事件。
更多关于 Systemd 的说明参见 {% post_link systemd 这篇文章 %}。

<!--more-->

## 1. 定时器单元
Timers 是以 .timer 为后缀的 systemd 单元文件。Timers 和其他单元配置文件是类似的，它通过相同的路径加载，不同的是包含了 [Timer] 部分。 [Timer] 部分定义了何时以及如何激活定时事件。Timers 可以被定义成以下两种类型：

#### 1.1. 单调定时器 
即从一个时间点过一段时间后激活定时任务。所有的单调计时器都遵循如下形式： OnTypeSec=。 OnBootSec 和 OnActiveSec 是常用的单调定时器。

#### 1.2. 实时定时器
通过日历事件激活定时任务。 使用 OnCalender= 来定义实时定时器。

要查阅完整的定时器选项参见 [Timer unit configuration][]。 关于日历事件和时间段的定义参见 [Time and date specifications][].

## 2. 服务单元
每个 .timer 文件所在目录都得有一个对应的 .service 文件（如 foo.timer 和 foo.service）。.timer 用于激活并控制 .service 文件。 
.service 文件中不需要包含 [Install] 部分，因为这由 timer 单元接管。必要时通过在定时器的 [Timer] 部分指定 Unit= 选项来控制一个与定时器不同名的服务单元。
更多服务单元说明参见 {% post_link systemd 这篇文章 %}。

## 3. 管理
使用 timer 单元时像其他单元一样 enable 或 start 即可（别忘了添加 .timer 后缀）。

#### 3.1. 查看单元文件
{% codeblock lang:'bash' line_number:'true' %}
# 查看所有单元
systemctl list-unit-files

# 查看所有 Service 单元
systemctl list-unit-files --type=service

# 查看所有 Timer 单元
systemctl list-unit-files --type=timer

# 查看所有正在运行的定时器
systemctl list-timers
{% endcodeblock %}

#### 3.2. 单元管理命令
{% codeblock lang:'bash' line_number:'true' %}
# 启动单元
systemctl start foo.timer

# 关闭单元
systemctl stop foo.timer

# 重启单元
systemctl restart foo.timer

# 杀死单元进程
systemctl kill foo.timer

# 查看单元状态
systemctl status foo.timer

# 开机自动执行该单元
systemctl enable foo.timer

# 关闭开机自动执行
systemctl disable foo.timer
{% endcodeblock %}

#### 3.3. 日志相关命令
{% codeblock lang:'bash' line_number:'true' %}
# 查看整个日志
journalctl

# 查看 foo.timer 的日志
journalctl -u foo.timer

# 查看 foo.timer 和 foo.service 的日志
journalctl -u foo

# 从结尾开始查看最新日志
journalctl -f

# 从结尾开始查看 foo.timer 的日志
journalctl -f -u foo.timer
{% endcodeblock %}

## 4. 配置示例
#### 4.1. 单调定时器
定义一个在系统启动 15 分钟后执行，且之后每周都执行一次的定时器。
{% codeblock /etc/systemd/system/foo.timer lang:'bash' line_number:'true' %}
[Unit]
Description=Run foo weekly and on boot

[Timer]
OnBootSec=15min
OnUnitActiveSec=1w 

[Install]
WantedBy=timers.target
{% endcodeblock %}

#### 4.2. 实时定时器
定义一个每周执行一次（明确时间为周一上午十二点）且上次未执行就立即执行的定时器。
{% codeblock /etc/systemd/system/foo.timer lang:'bash' line_number:'true' %}
[Unit]
Description=Run foo weekly

[Timer]
OnCalendar=weekly
Persistent=true     
 
[Install]
WantedBy=timers.target
{% endcodeblock %}

#### 4.3. 定时器单元文件说明
{% codeblock lang:'bash' line_number:'false' %}
OnActiveSec：定时器生效后，多少时间开始执行任务
OnBootSec：系统启动后，多少时间开始执行任务
OnStartupSec：Systemd 进程启动后，多少时间开始执行任务
OnUnitActiveSec：该单元上次执行后，等多少时间再次执行
OnUnitInactiveSec： 定时器上次关闭后多少时间，再次执行
OnCalendar：基于绝对时间，而不是相对时间执行
AccuracySec：如果因为各种原因，任务必须推迟执行，推迟的最大秒数，默认是60秒
Unit：真正要执行的任务，默认是同名的带有.service后缀的单元
Persistent：如果设置了该字段，即使定时器到时没有启动，也会自动执行相应的单元
WakeSystem：如果系统休眠，是否自动唤醒系统
{% endcodeblock %}

## 5. 案例一：定时追加文本
#### 5.1 创建脚本
{% codeblock lang:'bash' line_number:'true' %}
cd /root
touch backup_www.sh
chmod +x backup_www.sh
{% endcodeblock %}

{% codeblock backup_www.sh lang:'bash' line_number:'true' %}
#!/bin/bash

# 向 /root/backup_www.txt 文件中追加当前时间
mydate()
{
  date "+%Y-%m-%d %H:%M:%S"
}
backupdate=$(mydate)
echo ${backupdate} >> /root/backup_www.txt
{% endcodeblock %}

#### 5.2. 创建服务单元
{% codeblock /etc/systemd/system/backup_www.service lang:'bash' line_number:'true' %}
[Unit]
Description=www backup service

[Service]
User=www
Group=www
Type=simple
ExecStart=/root/backup_www.sh

[Install]
WantedBy=multi-user.target
{% endcodeblock %}


#### 5.2. 定时器单元
{% codeblock /etc/systemd/system/backup_www.timer lang:'bash' line_number:'true' %}
[Unit]
Description=www backup timer

[Timer]
# 表示每 15 分钟执行一次
OnCalendar=*:0/15
Persistent=true
Unit=backup_www.service

[Install]
WantedBy=multi-user.target
{% endcodeblock %}

#### 5.3. 创建链接并启动
{% codeblock lang:'bash' line_number:'true' %}
systemctl enable backup_www.service
systemctl enable backup_www.timer
systemctl start backup_www.timer

systemctl status backup_www.timer

● backup_www.timer - www backup timer
   Loaded: loaded (/etc/systemd/system/backup_www.timer; enabled; vendor preset: disabled)
   Active: active (running) since Tue 2018-07-24 12:36:10 UTC; 10min ago

Jul 24 12:36:10 e36d66eda18f systemd[1]: Started www backup timer.
Jul 24 12:36:10 e36d66eda18f systemd[1]: Starting www backup timer.
{% endcodeblock %}

每隔一分钟运行 `cat /root/backup_www.txt` 查看运行结果:
{% codeblock lang:'bash' line_number:'false' %}
2016-07-24 12:46:48
2016-07-24 12:47:48
2016-07-24 12:48:48
2016-07-24 12:49:48
2016-07-24 12:50:48
2016-07-24 12:51:48
2016-07-24 12:52:48
{% endcodeblock %}

## 6. 参考链接
· [Systemd GitHub][]
· [Systemd Office Site][]
· [Systemd Unit Man][]
· [Timer unit configuration][]
· [Time and date specifications][]


[Systemd GitHub]: https://github.com/systemd/systemd
[Systemd Office Site]: https://www.freedesktop.org/wiki/Software/systemd/
[Systemd Unit Man]: https://www.freedesktop.org/software/systemd/man/systemd.unit.html
[Timer unit configuration]: https://www.freedesktop.org/software/systemd/man/systemd.timer.html
[Time and date specifications]: https://www.freedesktop.org/software/systemd/man/systemd.time.html