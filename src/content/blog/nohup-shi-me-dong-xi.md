---
title: "nohup什么东西？"
description: "所以nohup是什么东西？"
pubDate: "2022-10-18 21:21:00"
categories: ["Linux"]
tags: ["Linux","nohup"]
draft: false
---
所以nohup是什么东西？

`nohup`是英语 no hangup 的缩写，是不挂断的意思，也就是指程序不退出，用在系统后台不挂断地运行命令，退出终端不会影响程序的运行。

在工作中，我们可能经常要在服务器上跑程序，有可能要跑的程序耗时很长，需要运行一段时间，我们希望即使关闭终端，程序不受影响，继续运行。在Linux中的`nohup`命令可以达到这种效果。

## 命令语法

```bash
nohup 命令 参数
nohup 选项
```

说明：

```bash
--help     # 显示此帮助信息并退出
--version  # 显示版本信息并退出
```

## Demo案例

准备一个test.py程序，功能是每隔2秒会输出”hello nohup!”：

```python
import time 

while True:
    print("hello nohup!")
    time.sleep(2)
```

然后使用`nohup python3 test.py`运行。

使用nohup命令时，程序的输出会默认重定向到一个nohup.out文件下。若是想要输出到指定的文件，则可以另外指定输出文件。

```bash
nohup python3 test.py > out.txt
```

但是现在还做不到让程序在后台运行，如果想要让程序在后台运行的话，可以加上 &

```bash
nohup python3 test.py > out.txt &
```

此时关掉终端再重新打开，使用ps命令查看一下进程，发现程序还在运行。

这里如果想要把标准错误和标准输出都重定向到指定的out.txt文件中，可以使用`2>&1`符号，`2>&1`符号的意思是将将标准错误 2 重定向到标准输出 &1。

-   0 stdin (standard input，标准输入)
-   1 stdout (standard output，标准输出)
-   2 stderr (standard error，标准错误输出)

具体详情见：2>&1到底是什么意思？

```bash
nohup python3 test.py > out.txt 2>&1 &
```

`nohup`命令结合`&`符号可以使进程在后台运行，即使关闭了终端依然不受影响。

那么如何结束进程呢？

## kill

执行一个`kill`命令时，实际上是发送了一个信号给系统，让它去结束掉一些不正常的应用进程。 可以使用`kill -l`命令看到所有信号的列表：

![](/images/hexo/2022/10/18/nohup-shi-me-dong-xi/image-20221018215614795.png)

下面是一些常用信号的含义：

```bash
(1)SIGHUP 终端线路挂断，终止进程
(2)SIGINT 中断进程（同 Ctrl + C）
(3)SIGQUIT 退出进程（同 Ctrl + \）
(15)SIGTERM 终止进程
(9)SIGKILL 强制终止进程
(18)SIGCONT 继续（与SIGSTOP相反， fg/bg命令）
(19)SIGSTOP 暂停（同 Ctrl + Z）
```

常用到的有15 和 9

(15)SIGTERM：也就是执行`kill -15 pid`命令，这里”-15”即代表SIGTERM信号。  
注意：SIGTERM是默认选项，也就是说执行`kill pid`和`kill -15 pid`是等价的。  
执行此指令时操作系统会发送一个SIGTERM信号给对应的程序，当程序接收到该信号后，可以用一段时间来正常关闭，一般会先保存进度并释放资源，然后再停止，也就是不一定会立即停止进程，比如程序正在等待IO，可能就不会立马停止运行。也就是说，(15)SIGTERM信号不是强制停止，是可以被忽略的。

(9)SIGKILL：也就是执行`kill -9 pid`命令，这里”-9”即代表SIGKILL信号。  
是必杀信号，此信号强制进程立即停止运行。程序不能忽略此信号，而未保存的进度将会丢失，从而可能会影响服务的再次启动，此命令应该慎用。

kill语法：

```bash
kill 信号或选项 pid
```

默认信号（当没有指定的时候）是SIGTERM。当它不起作用时，可以使用`kill -9 pid`命令来强制kill掉一个进程。

应用的pid可以使用以下的命令查看：

```bash
ps -ef
ps -aux
```

二者都可以查看到pid

![](/images/hexo/2022/10/18/nohup-shi-me-dong-xi/image-20221018215918762.png)

比如想要kill掉PID为108的进程，只需要执行`kill -9 108`即可。
