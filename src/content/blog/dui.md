---
title: "堆"
description: "队列是一种先进先出（FIFO）的数据结构，但是有些情况下，操作的数据可能带有优先级，一般出队列时，可能需要优先级高的元素先出队列，在这种情况下使用队列就不行了，比如玩王者的时候突然女朋友一通电话，游戏屏幕瞬间被电话占领，这时候就应该优先处理"
pubDate: "2022-11-30 14:49:00"
categories: ["算法"]
tags: ["java"]
draft: false
---
# 一、堆

## 1、概念

队列是一种先进先出（FIFO）的数据结构，但是有些情况下，操作的数据可能带有优先级，一般出队列时，可能需要优先级高的元素先出队列，在这种情况下使用队列就不行了，比如玩王者的时候突然女朋友一通电话，游戏屏幕瞬间被电话占领，这时候就应该优先处理电话。

在这种情况下，我们的数据结构应该提供两个最基本的操作，一个是返回最高优先级对象，一个是添加新对象，这种数据结构就是优先级队列（PriorityQueue）。

PriorityQueue 的底层是堆，堆的底层是数组。

Java集合框架中提供了**PriorityQueue**和**PriorityBlockingQueue**两种类型的优先级队列，PriorityQueue是**线程不安全**的，PriorityBlockingQueue是**线程安全**的，这里主要使用PriorityQueue。

-   PriorityQueue中放置的元素必须要能够比较大小 （只有实现了 Comparable 和 Comparator 接口的类才能比较大小），不能插入无法比较大小的对象，否则会抛出 ClassCastException 异常
-   不能插入 null 对象，否则会抛出 NullPointerException 异常
-   没有容量限制，可以插入任意多个元素，其内部可以自动扩容
-   插入和删除元素的时间复杂度均为 O(log2N)
-   PriorityQueue底层使用了堆数据结构

## 2、常用接口

| 函数名 | 功能介绍 |
| --- | --- |
| boolean offer(E e) | 插入元素 e，插入成功返回 true，如果 e 对象为空，抛出 NullPointerException 异常，时间复杂度为 O(log2N) ，注意：空间不够时会自动扩容 |
| E peek() | 获取优先级最高的元素，如果优先级队列为空，返回 null |
| E poll() | 移除优先级最高的元素并返回，如果优先级队列为空，返回 null |
| int size() | 获取有效元素的个数 |
| void clean() | 清空 |
| boolean isEmpty() | 检测优先级队列是否为空，空返回 true |

## 3、通过数组实现小顶堆

参考链接：[深入理解Java PriorityQueue](https://www.cnblogs.com/CarpenterLee/p/5488070.html)

**优先队列的作用是能保证每次取出的元素都是队列中权值最小的**（Java的优先队列每次取最小元素，C++的优先队列每次取最大元素）。这里牵涉到了大小关系，**元素大小的评判可以通过元素本身的自然顺序（\*natural ordering\*），也可以通过构造时传入的比较器**（*Comparator*，类似于C++的仿函数）。

Java中*PriorityQueue*实现了*Queue*接口，不允许放入`null`元素；其通过堆实现，具体说是通过完全二叉树（*complete binary tree*）实现的**小顶堆**（任意一个非叶子节点的权值，都不大于其左右子节点的权值），也就意味着可以通过数组来作为*PriorityQueue*的底层实现。

![](/images/hexo/2022/11/30/dui/image-20221130145800596.png)

父节点和子节点的编号是有联系的：

1.  leftNo = parentNo\*2+1
2.  rightNo = parentNo\*2+2
3.  parentNo = (nodeNo-1)/2

所以可以用数组来存储堆，可以轻易计算出某个节点的父节点以及子节点的下标。

*PriorityQueue*的`peek()`和`element`操作是常数时间，`add()`, `offer()`, 无参数的`remove()`以及`poll()`方法的时间复杂度都是*log(N)*。

### 1、add()和offer()

以上图为例，假如现在要插入节点的值4，要做两件事，一件事是将4放在数组末尾，另一件事就是调整，将4调整至合适的位置。

过程如下：

![](/images/hexo/2022/11/30/dui/image-20221130150159033.png)

```java
//offer(E e)
public boolean offer(E e) {
    if (e == null)//不允许放入null元素
        throw new NullPointerException();
    modCount++;
    int i = size;
    if (i >= queue.length)
        grow(i + 1);//自动扩容
    size = i + 1;
    if (i == 0)//队列原来为空，这是插入的第一个元素
        queue[0] = e;
    else
        siftUp(i, e);//调整
    return true;
}
```

`siftUp(int k, E x)`方法，该方法用于插入元素`x`并维持堆的特性。

```java
//siftUp()
private void siftUp(int k, E x) {
    while (k > 0) {
        int parent = (k - 1) >>> 1;//parentNo = (nodeNo-1)/2
        Object e = queue[parent];
        if (comparator.compare(x, (E) e) >= 0)//调用比较器的比较方法
            break;
        queue[k] = e;
        k = parent;
    }
    queue[k] = x;
}
```

**从`k`指定的位置开始，将`x`逐层与当前点的`parent`进行比较并交换，直到满足`x >= queue[parent]`为止**。注意这里的比较可以是元素的自然顺序，也可以是依靠比较器的顺序。

* * *

### 2、element()和peek()

`element()`和`peek()`的语义完全相同，都是获取但不删除队首元素，也就是队列中权值最小的那个元素，二者唯一的区别是当方法失败时前者抛出异常，后者返回`null`。

![](/images/hexo/2022/11/30/dui/image-20221130150628437.png)

直接返回3即可

```java
//peek()
public E peek() {
    if (size == 0)
        return null;
    return (E) queue[0];//0下标处的那个元素就是最小的那个
}
```

### 3、remove()和poll()

`remove()`和`poll()`方法的语义也完全相同，都是获取并删除队首元素，区别是当方法失败时前者抛出异常，后者返回`null`。

![](/images/hexo/2022/11/30/dui/image-20221130150734479.png)

删除掉第一个之后，将最后一个元素放到第一个的位置上，然后往下调整

```java
public E poll() {
    if (size == 0)
        return null;
    int s = --size;
    modCount++;
    E result = (E) queue[0];//0下标处的那个元素就是最小的那个
    E x = (E) queue[s];
    queue[s] = null;
    if (s != 0)
        siftDown(0, x);//调整
    return result;
}
```

**从`k`指定的位置开始，将`x`逐层向下与当前点的左右孩子中较小的那个交换，直到`x`小于或等于左右孩子中的任何一个为止**。

```java
//siftDown()
private void siftDown(int k, E x) {
    int half = size >>> 1;
    while (k < half) {
    //首先找到左右孩子中较小的那个，记录到c里，并用child记录其下标
        int child = (k << 1) + 1;//leftNo = parentNo*2+1
        Object c = queue[child];
        int right = child + 1;
        if (right < size &&
            comparator.compare((E) c, (E) queue[right]) > 0)
            c = queue[child = right];
        if (comparator.compare(x, (E) c) <= 0)
            break;
        queue[k] = c;//然后用c取代原来的值
        k = child;
    }
    queue[k] = x;
}
```
