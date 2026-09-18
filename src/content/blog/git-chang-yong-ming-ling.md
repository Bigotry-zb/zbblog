---
title: "Git常用命令"
description: ""
pubDate: "2022-10-19 21:10:00"
categories: ["Linux"]
tags: ["Linux","git"]
draft: false
---
## 1、创建版本库

```bash
$ git clone <url> #克隆远程版本

$ git init #初始化本地版本库

$ git config --global user.name 用户名 #设置用户名

$ git config --global user.email 邮箱 #设置邮箱
```

## 2、修改和提交代码

```bash
$ git status #查看状态

$ git diff #查看便变更内容

$ git add . #跟踪所有改动的文件

$ git add <file> #跟踪指定的文件

$ git mv <old> <new> #文件改名

$ git rm <file> #删除文件

$ git rm --cached file #停止跟踪文件但不删除

$ git commit -m "commit message" #提交所有更新过的文件

$ git commit -- amend #修改最后一次提交
```

## 3、查看历史提交

```bash
$ git long #查看提交历史

$ git log -p <file> #查看指定文件的提交历史

$ git blame <file> #以列表方式查看指定文件的提交历史
```

## 4、撤销

```bash
$ git reset --hard HEAD #撤销工作目录中所有未提交文件的修改内容

$ git checkout  HEAD file #撤销指定的未提交文件的修改内容

$ git revert <commit> #撤销指定的提交
```

## 5、分支、标签

```bash
$ git branch #显示所有本地分支

$ git checkout <branch/tag> #切换到指定分支或标签

$ git branch <new-branch> #创建新的分支

$ git branch -d <branch> # 删除本地分支

$ git tag #列出所有本地标签

$ git tag <tagname> #基于最新提交创建标签

$ git tag -d <tagname> #删除标签
```

## 6、合并与衍合

```bash
$ git merge <branch> #合并指定分支到当前分支

$ git rebase <branch> #衍合指定分支到当前分支
```

## 7、远程操作

```bash
$ git remote -v #查看远程版本信息

$ git remote show <remote> # 查看指定远程版本库的信息

$ git remote add <remote> url #添加远程版本库

$ git fetch <remote> #从远程获取代码

$ git pull <remote> <branch> #下载代码及快速合并

$ git push <remote> <branch> #上传代码及快速合并

$ git push <remote> :<branch/tag-name> #删除远程分支或标签

$ git push --tags #上传所有标签
```
