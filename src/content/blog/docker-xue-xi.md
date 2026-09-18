---
title: "Docker学习笔记"
description: "Docker 使用 Google 公司推出的 Go 语言 进行开发实现，基于 Linux 内核 的cgroup，namespace，以及 AUFS 类的 UnionFS 等技术，对进程进行封装隔离，属于操作系统层面的虚拟化技术。 由于隔离的"
pubDate: "2022-09-19 21:42:00"
categories: ["Linux"]
tags: ["docker","image","dockerfile","Linux"]
draft: false
---
## 一、为何要用Docker?

### 1、什么是Docker?

Docker 使用 Google 公司推出的 Go 语言 进行开发实现，基于 Linux 内核 的cgroup，namespace，以及 AUFS 类的 UnionFS 等技术，对进程进行封装隔离，属于操作系统层面的虚拟化技术。 由于隔离的进程独立于宿主和其它的隔离的进 程，因此也称其为容器。Docker 最初实现是基于 LXC.

Docker 能够自动执行重复性任务，例如搭建和配置开发环境，从而解放了开发人员以便他们专注在真正重要的事情上，构建杰出的软件。

用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

### 2、Docker的优点：

-   环境隔离(‘**隔离，安全**‘)
    
    Docker 实现了资源隔离，一台机器运行多个容器互无影响。
    
-   更高效的资源利用(**节约成本**)
    
    Docker 容器的运行不需要额外的虚拟化管理程序的支持，它是内核级的虚拟化，可以实现更高的性能，同时对资源的额外需求很低。
    
-   更快速的交付部署(**敏捷**)
    
    使用 Docker，开发人员可以利用镜像快速构建一套标准的研发环境，开发完成后，测试和运维人员可以直接通过使用相同的环境来部署代码。
    
-   更易迁移扩展(**可移植性**)
    
    Docker 容器几乎可以在任意的平台上运行，包括虚拟机、公有云、私有云、个人电脑、服务器等，这种兼容性让用户可以在不同平台之间轻松的迁移应用。
    
-   更简单的更新管理(**高效**)
    
    使用 Dockerfile，只需要很少的配置修改，就可以替代以往大量的更新工作。并且所有修改都是以增量的方式进行分发和更新，从而实现自动化和高效的容器管理。
    

### 3、Docker 的基本组成架构

具体参考[Docker搭建你的第一个 Node 项目到服务器(完整版)](https://juejin.cn/post/6844904035053486087#heading-2)

#### Registry

镜像仓库，存储大量镜像，可以从镜像仓库拉取和推送镜像。

#### Docker 镜像

类似虚拟机快照，从仓库拉取，或者在现有工具镜像上创建新镜像。通过镜像可以启动容器。

#### Docker 容器

从镜像中创建应用环境，以单进程的方式运行。对外公开服务。是一种短暂的和一次性的环境。

#### Docker 数据卷

数据卷可以完成数据持久化，数据卷是一个可供一个或多个容器使用的特殊目录，它绕过 UFS，可以提供很多有用的特性：

-   数据卷可以在容器之间共享和重用
-   对数据卷的修改会立马生效
-   对数据卷的更新，不会影响镜像
-   卷会一直存在，直到没有容器使用

#### Docker 网络

Docker 容器之间的网络交互，可以使用`端口映射`的方式，其他容器可以直接通过端口实现。除该方式外还有一个`容器连接（linking）系统`也可以达到容器交互。（本文中 node 连接 mongodb 使用的是端口映射的方式）

关于Docker 网络模块，容器连接详情推荐这篇文章: [Docker的网络模式详解](https://juejin.cn/post/6844903756920782855)

### 4、Docker的常用命令（常用）

#### 镜像常用命令

```bash
docker pull [镜像名称:版本] 拉取镜像
docker images  镜像列表
docker rmi [镜像名称:版本] 删除镜像
docker history [镜像名称] 镜像操作记录
docker tag [镜像名称:版本][新镜像名称:新版本]
docker inspect [镜像名称:版本] 查看镜像详细
docker search [关键字] 搜索镜像
docker login 镜像登陆
```

#### 容器常用命令

```bash
docker ps -a 容器列表(所有容器)
docker ps  查看所有(运行的)容器
docker exec -ti <id> bash  以 bash 命令进入容器内
docker run -ti --name [容器名称][镜像名称:版本] bash 启动容器并进入
docker logs 查看容器日志
docker top <container_id> 查看容器最近的一个进程
docker run -ti --name [容器名称] -p 8080:80 [镜像名称:版本] bash  端口映射
docker rm <container_id> 删除容器
docker stop <container_id> 停止容器
docker start <container_id> 开启容器
docker restart <container_id> 重启容器
docker inspect <container_id> 查看容器详情
docker commit [容器名称] my_image:v1.0  容器提交为新的镜像
```

#### DockerFile常用命令

见第六节

## 二、CentOs 7 上Docker安装部署

### 1、若是以前安装过docker，先执行以下步骤

1.  更新yum包（生产环境中慎重）
    
    ```bash
yum -y update
```
    
    此命令不是必须，有服务器重启一下服务器
    
2.  卸载旧版本
    
    ```bash
yum remove docker  docker-common docker-selinux docker-engine
```

### 2、安装docker的详细步骤

1.  首先安装需要的软件包
    
    ```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```
2.  设置yum源，我使用的是阿里仓库
    
    ```bash
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
3.  选择docker版本并安装  
    查看可用的版本：
    
    ```bash
yum list docker-ce --showduplicates | sort -r
```
    
    选择一个版本并安装：
    
    ```bash
yum install docker-ce-版本号
```
    
    我安装的是:
    
    ```bash
yum -y install docker-ce-18.03.1.ce
```
4.  启动docker并设置开机自启
    
    ```bash
systemctl start docker
systemctl enable docker
```

## 三、image文件

**Docker 把应用程序及其依赖，打包在 image 文件里面。**只有通过这个文件，才能生成 Docker 容器。image 文件可以看作是容器的模板。Docker 根据 image 文件生成容器的实例。同一个 image 文件，可以生成多个同时运行的容器实例。

image 是二进制文件。实际开发中，一个 image 文件往往通过继承另一个 image 文件，加上一些个性化设置而生成。举例来说，你可以在 Ubuntu 的 image 基础上，往里面加入 Apache 服务器，形成你的 image。

> ```bash
# 列出本机的所有 image 文件。
docker image ls

# 删除 image 文件
docker image rm [imageName]
```

image 文件是通用的，一台机器的 image 文件拷贝到另一台机器，照样可以使用。一般来说，为了节省时间，我们应该尽量使用别人制作好的 image 文件，而不是自己制作。即使要定制，也应该基于别人的 image 文件进行加工，而不是从零开始制作。

为了方便共享，image 文件制作完成后，可以上传到网上的仓库。Docker 的官方仓库 [Docker Hub](https://hub.docker.com/) 是最重要、最常用的 image 仓库。

## 四、实例：“Hello world”

通过最简单的“Hello world”实例感受一下image文件

首先，运行下面的命令，将 image 文件从仓库抓取到本地。

> ```bash
$ docker image pull library/hello-world
```

上面代码中，`docker image pull`是抓取 image 文件的命令。`library/hello-world`是 image 文件在仓库里面的位置，其中`library`是 image 文件所在的组，`hello-world`是 image 文件的名字。

由于 Docker 官方提供的 image 文件，都放在[`library`](https://hub.docker.com/r/library/)组里面，所以它的是默认组，可以省略。因此，上面的命令可以写成下面这样。

> ```bash
$ docker image pull hello-world
```

抓取成功以后，就可以在本机看到这个 image 文件了。

> ```bash
$ docker image ls
```

现在，运行这个 image 文件。

> ```bash
$ docker container run hello-world
```

`docker container run`命令会从 image 文件，生成一个正在运行的容器实例。

注意，`docker container run`命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，就会从仓库自动抓取。因此，前面的`docker image pull`命令并不是必需的步骤。

如果运行成功，你会在屏幕上读到下面的输出。

> ```bash
$ docker container run hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.

... ...
```

输出这段提示以后，`hello world`就会停止运行，容器自动终止。

有些容器不会自动终止，因为提供的是服务。比如，安装运行 Ubuntu 的 image，就可以在命令行体验 Ubuntu 系统。

> ```bash
$ docker container run -it ubuntu bash
```

对于那些不会自动终止的容器，必须使用[`docker container kill`](https://docs.docker.com/engine/reference/commandline/container_kill/) 命令手动终止。

> ```bash
$ docker container kill [containID]
```

## 五、容器文件

**image 文件生成的容器实例，本身也是一个文件，称为容器文件。**也就是说，一旦容器生成，就会同时存在两个文件： image 文件和容器文件。而且关闭容器并不会删除容器文件，只是容器停止运行而已。

> ```bash
# 列出本机正在运行的容器
$ docker container ls

# 列出本机所有容器，包括终止运行的容器
$ docker container ls --all
```

上面命令的输出结果之中，包括容器的 ID。很多地方都需要提供这个 ID，比如上一节终止容器运行的`docker container kill`命令。

终止运行的容器文件，依然会占据硬盘空间，可以使用[`docker container rm`](https://docs.docker.com/engine/reference/commandline/container_rm/)命令删除。

> ```bash
$ docker container rm [containerID]
```

运行上面的命令之后，再使用`docker container ls --all`命令，就会发现被删除的容器文件已经消失了。

## 六、Dockerfile部署Spring Boot 项目

### 1、将已有的spring boot 项目打包

### 2、在linux中创建一个文件夹，例如我创建为 /root/docker\_test/jar01

```bash
mkdir /root/docker_test/jar01
```

### 3、将jar包上传到linux文件夹中

利用MobaxTerm将jar包上传到jar01中

### 4、编写DockerFile文件

```bash
# 基于java镜像创建新镜像
FROM openjdk:11
# 作者
MAINTAINER zbiao
# 将jar包添加到容器中并更名为app.jar
ADD  demo-helloworld.jar app.jar
# 运行jar包
ENTRYPOINT ["java","-jar","app.jar"]
```

ADD 后面是源文件，再后面才是目标文件

> 注意：ADD、COPY 指令用法一样，唯一不同的是 ADD 支持将归档文件（tar, gzip, bzip2, etc）做提取和解压操作。还有需要注意的是，COPY 指令需要复制的目录一定要放在 Dockerfile 文件的同级目录下。

参考：[LPxz的个人博客](http://lpxz.work/2022/07/04/Docker%20%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/#%E5%B8%B8%E7%94%A8%E8%BD%AF%E4%BB%B6-%E6%9C%8D%E5%8A%A1%E5%AE%89%E8%A3%85%E9%83%A8%E7%BD%B2-updating%E2%80%A6)

### 5、制作镜像

```bash
docker build -t zbdemo .
```

注意是在jar01目录下

### 6、启动容器

```bash
docker run -d -p 8080:8080 --name zbdemo03 zbdemo:latest
```

命令参数：

-   \-d：后台运行
-   \-p：公开指定端口号
-   \-name：容器命名

启动后可通过 `docker ps` 查看正在运行的容器：

```bash
[root@VM-8-10-centos jar01]# docker ps
CONTAINER ID        IMAGE               COMMAND               CREATED             STATUS              PORTS                    NAMES
618cf8b1a0a8        zbdemo:latest       "java -jar app.jar"   14 minutes ago      Up 13 minutes       0.0.0.0:8080->8080/tcp   zbdemo04
45d6deb5444a        zbdemo:latest       "java -jar app.jar"   16 minutes ago      Up 16 minutes       0.0.0.0:8082->8082/tcp   zbdemo03
```

### 7、查看启动日志

我们可以通过 `docker logs name` 查看指定容器的日志，后面name为容器名，如zbdemo03

### 8、DockerFile配置参数

FROM：FROM 是构建镜像的基础源镜像，该 Image 文件继承官方的 node image。

详细说明：Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令！ 它引入一个镜像作为我们要构建镜像的基础层，就好像我们首先要安装好操作系统，才可以在操作系统上面安装软件一样。

RUN：后面跟的是在容器中要执行的命令。

详细说明：每一个 `RUN` 指令都会新建立一层，在其上执行这些命令，我们频繁使用 `RUN` 指令会创建大量镜像层，然而 `Union FS` 是有最大层数限制的，不能超过 `127` 层，而且我们应该把每一层中我用文件清除，比如一些没用的依赖，来防止镜像臃肿。

WORKDIR：容器的工作目录

COPY：拷贝文件至容器的工作目录下，.dockerignore 指定的文件不会拷贝

EXPOSE：将容器内的某个端口导出供外部访问

CMD：Dockerfile 执行写一个 CMD 否则后面的会被覆盖，CMD 后面的命令是容器每次启动执行的命令，多个命令之间可以使用 && 链接，例如 CMD git pull && npm start

详细说明:`CMD` 指令用来在启动容器的时候，指定默认的容器主进程的启动命令和参数。
