---
title: "链表"
description: ""
pubDate: "2022-09-21 11:14:00"
categories: ["算法"]
tags: ["java","链表"]
draft: false
---
# 一、理论

## 1、链表类型

### 1、单链表

![](/images/hexo/2022/09/21/lian-biao/image-20221011101058417.png)

### 2、双链表

![](/images/hexo/2022/09/21/lian-biao/image-20221011101124093.png)

### 3、循环链表

循环链表可以用来解决`约瑟夫环`问题

![](/images/hexo/2022/09/21/lian-biao/image-20221011101149273.png)

## 2、链表存储方式

数组在内存中是连续分布的，但链表在内存中不是连续分布的。

链表是通过指针域的指针来连接各个节点。所以链表的分配机制取决于操作系统的内存管理。

## 3、链表的定义

```java
public class ListNode {
    // 结点的值
    int val;

    // 下一个结点
    ListNode next;

    // 节点的构造函数(无参)
    public ListNode() {
    }

    // 节点的构造函数(有一个参数)
    public ListNode(int val) {
        this.val = val;
    }

    // 节点的构造函数(有两个参数)
    public ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}
```

## 4、链表的基本操作

### 1、删除节点

![](/images/hexo/2022/09/21/lian-biao/image-20221011101632656.png)

删除D节点，直接将C节点的next节点指向E即可。java有自己的内存回收机制，不用自己手动释放。

### 2、添加节点

![](/images/hexo/2022/09/21/lian-biao/image-20221011101738080.png)

增加F节点，先将F节点的next指向D，再将C节点的next指向F。

但是有一点需要注意，在C后增加节点，首先得找到C节点，找节点的复杂度是O(n)

## 5、链表与数组的性能对比

![](/images/hexo/2022/09/21/lian-biao/image-20221011102001636.png)

# 二、翻转链表

## 1、翻转整个链表

先上`本次`的链表定义

```java
public class Node {
    public int value;
    public Node next;

    public Node(int data) {
        this.value = data;
    }
}
```

1、双指针法

只需要改变链表的next指向即可

![](/images/hexo/2022/09/21/lian-biao/image-20220921114419429.png)

首先定义cur节点，指向head；再定义pre指向null。

pre节点是cur节点的前序节点

先将cur.next节点保存在temp里，再进行翻转。保存在temp是为了防止下一个节点丢失。

到最后cur为null时，pre为最后一个节点，此时返回pre即可。

```java
public static Node reverse(Node head) {
    Node pre = null;
    Node cur = head;
    Node temp = null;
    while (cur != null) {   // 以下注释以1 2为例
        temp = cur.next;   // temp指向2
        cur.next = pre;    // 1 和 2 之间已经断链， 1 已经指向了pre，也就是空

        pre = cur;     //  同时向后移
        cur = temp;
    }
    return pre;
}
```

2、递归法

递归法其实跟双指针法类似，每一步翻转都有三个过程：

1.  记录下一个节点
2.  翻转
3.  同时往后移

```java
public static void main(String[] args) {
    //  其他代码
    Node res = reverse(null, node1);    // node1 为已定义好的链表的头结点
    while (res != null) {
        System.out.print(res.value + " ");
        res = res.next;
    }
}
``` ```java
public static Node reverse(Node pre, Node cur) {
    if (cur == null) {
        return pre;
    }
    Node temp = cur.next;  //记录下一个节点
    cur.next = pre;     // 翻转

    return reverse(cur, temp);   //向后移
}
```

## 2、翻转部分链表

给定一个链表的头结点，给定m和n，要求翻转m到n之间的链表

思路：使用头插法

1.  首先找到m节点的前一个节点，定义为pre，这个pre就相当于头插法的头结点的前序节点
2.  用一个for循环，遍历从m到n，进行链表的头插
3.  最后返回头结点即可

代码如下：

```java
public ListNode reverseBetween (ListNode head, int m, int n) {
        // write code here
        ListNode res = new ListNode(-1);
        res.next = head;
        ListNode cur = head;
        ListNode pre = res;
        for (int i = 1; i < m; i++) {
            pre = cur;
            cur = cur.next;
        }
        for (int i = m; i < n; i++) {
            ListNode temp = cur.next;
            cur.next = temp.next;

            temp.next = pre.next;
            pre.next = temp;
        }
        return res.next;
    }
```

> 之所以定义res节点，是为了方便操作头结点，即当m为1时不用对头结点进行特殊处理

# 三、环形链表

环形链表一共有两个问题，第一个问题是验证一个链表是否有环，第二个问题是找到环形链表的入口。

先来看第一个问题

## 1、验证链表是否有环

判断链表是否有环，可以使用快慢指针法，定义一个fast，以及一个slow，slow每走一步，fast就走两步，若是有环的话，那么最终一定会相遇。

为什么？

首先肯定是fast先进环，当slow进环时，slow走一步fast走两步，整体来看就是fast在追赶slow一步，那么只要有环，最终fast就一定会追上slow。

## 2、若有环，如何找到入口？

用公式来表示一下。

假设从头结点到环形入口节点 的节点数为x。 环形入口节点到 fast指针与slow指针相遇节点 节点数为y。 从相遇节点 再到环形入口节点节点数为 z。 如图所示：

![](/images/hexo/2022/09/21/lian-biao/image-20221013094802419.png)

那么在相遇时，slow走了（x + y），fast走了(x + y + n \* (y + z))。fast有可能在环内走了n圈。根据步长，可以看出fast走的距离是slow的二倍，即：

2 \* (x + y) = x + y + n \* (y + z)

两边消去一个 x + y：

x + y = n \* (y + z)

要找到入口，那就是要求x的距离，将x放在一边：

x = n \* (y + z) - y

整理之后就是：

x = (n - 1) \* (y + z) + z

假设n = 1时，n = 1意味着fast在环内走了一圈就碰见slow了，这时候计算入口时(x = z)，`只需要在他们相遇的节点处定义一个index1，在头结点处定义一个index2，令他们每次走一步，相遇即为入口节点`。

若是n > 1时，fast指针在环形转n圈之后才遇到 slow指针。该问题也可简化为n = 1，其实本质上都一样，只不过index1在环内多转了几圈，然后碰到index2。

> 有个疑问：那为什么在环中相遇时，slow走过的距离一定是x + y，而不是 x + 若干环的距离 + y 呢？

因为当slow进环时，fast一定在环内，而fast和slow每走一次就相当于fast在靠近slow一步，所以当slow还没进入到下一次循环的时候，就会被fast追上。

# 四、经典题目

## 1、合并k个已排序的链表

原题链接：[BM5 合并k个已排序的链表](https://www.nowcoder.com/practice/65cfde9e5b9b4cf2b6bafa5f3ef33fa6?tpId=295&tqId=724&ru=/exam/oj&qru=/ta/format-top101/question-ranking&sourceUrl=%2Fexam%2Foj)

三种方法

### 1、方法一：借用辅助空间

思路：既然要合并k个链表，那么先定义一个list，将这些链表的值都存入进list，最后对list进行排序，然后一一取出并将其组成链表即可

代码如下：

```java
public ListNode mergeKLists(ArrayList<ListNode> lists) {
    // 定义虚拟头结点
        ListNode dummy = new ListNode(-1);
        ListNode cur = dummy;
        ArrayList<Integer> array = new ArrayList<>();
        int n = lists.size();
        for (int i = 0; i < n; i++) {
            ListNode node = lists.get(i);
            while (node != null) {
                array.add(node.val);
                node = node.next;
            }
        }
        Collections.sort(array);
        for (int i = 0; i < array.size(); i++) {
            ListNode ccc = new ListNode(array.get(i));
            cur.next = ccc;
            cur = cur.next;
        }
    // 最后返回虚拟头结点的下一个节点
        return dummy.next;
    }
```

当然时间复杂度是比较高的，排序就需要O(n \* log2n)

### 2、方法二：优先队列

优先队列方法类似于双指针，都是从几个中选出最小的。优先队列是一种内置的基于堆排序的容器，分为大顶堆和小顶堆，小顶堆就是堆顶为最小的元素。本题采用小顶堆。

使用优先队列时，必须要手动`重载比较方法`。因为容器内部的次序基于堆排序，因此每次插入元素时间复杂度都是O(log2n)，而每次取出堆顶元素都是直接取出。

思路：

1.  遍历k个链表头，将不是空节点的节点放进优先队列
2.  优先队列弹出最小值，并且若弹出的节点的下一个节点不为空，就将下一个节点放进优先队列

具体代码如下：

```java
public ListNode mergeKLists(ArrayList<ListNode> lists) {
        //小顶堆
        Queue<ListNode> pq = new PriorityQueue<>((v1, v2) -> v1.val - v2.val);
        //遍历所有链表第一个元素
        for(int i = 0; i < lists.size(); i++){
            //不为空则加入小顶堆
            if(lists.get(i) != null)
                pq.add(lists.get(i));
        }
        //加一个表头
        ListNode dummy = new ListNode(-1);
        ListNode head = dummy;
        //直到小顶堆为空
        while(!pq.isEmpty()){
            //取出最小的元素
            ListNode temp = pq.poll();
            //连接
            head.next = temp;
            head = head.next;
            //每次取出链表的后一个元素加入小顶堆
            if(temp.next != null)
                pq.add(temp.next);
        }
        //去掉表头
        return dummy.next;
    }
```

时间复杂度：O(n \* log 2 \* k)，每次加入优先队列排序需要O(log2k)

### 3、方法三：归并排序思想【推荐】

首先需要明确两个概念。

1、双指针

双指针指的是在遍历对象的过程中，不是普通的使用单个指针进行访问，而是使用两个指针（特殊情况甚至可以多个），两个指针或是同方向访问两个链表、或是同方向访问一个链表（快慢指针）、或是相反方向扫描（对撞指针），从而达到我们需要的目的。

2、分治

分治分治，分而治之。“分”指的是将一个大而复杂的问题划分成多个性质相同但是规模更小的子问题，子问题继续按照这样划分，直到问题可以被轻易解决；“治”指的是将子问题单独进行处理。经过分治后的子问题，需要将解进行合并才能得到原问题的解，因此整个分治过程经常用递归来实现。

其实这道题也可以两两比较，只要遍历链表数组，取出开头的两个链表，按照上述思路合并，然后新链表再与后一个继续合并，如此循环，知道全部合并完成。但是，太浪费时间。

可不可以直接归并的分治来做，而不是顺序遍历合并链表呢？可以！

归并排序简单来说就是将一个数组每次划分成等长的两部分，对两部分进行排序即是子问题。对子问题继续划分，直到子问题只有1个元素。还原的时候呢，将每个子问题和它相邻的另一个子问题利用上述双指针的方式，1个与1个合并成2个，2个与2个合并成4个，因为这每个单独的子问题合并好的都是有序的，直到合并成原本长度的数组。

对于这k个链表，就相当于上述合并阶段的k个子问题，需要划分为链表数量更少的子问题，直到每一组合并时是两两合并，然后继续往上合并，这个过程基于递归：

-   **终止条件：** 划分的时候直到左右区间相等或左边大于右边。
-   **返回值：** 每级返回已经合并好的子问题链表。
-   **本级任务：** 对半划分，将划分后的子问题合并成新的链表。

简单画个图来帮助理解一下：

![](/images/hexo/2022/09/21/lian-biao/image-20221027112036683.png)

若是有五个链表需要合并，分治就是右边的情况

具体代码如下：

```java
//两个链表合并函数
   public ListNode Merge(ListNode list1, ListNode list2) {
       //一个已经为空了，直接返回另一个
       if(list1 == null)
           return list2;
       if(list2 == null)
           return list1;
       //加一个表头
       ListNode dummy = new ListNode(0);
       ListNode cur = dummy;
       //两个链表都要不为空
       while(list1 != null && list2 != null){
           //取较小值的节点
           if(list1.val <= list2.val){
               cur.next = list1;
               //只移动取值的指针
               list1 = list1.next;
           }else{
               cur.next = list2;
               //只移动取值的指针
               list2 = list2.next;
           }
           //指针后移
           cur = cur.next;
       }
       //哪个链表还有剩，直接连在后面
       if(list1 != null)
           cur.next = list1;
       else
           cur.next = list2;
       //返回值去掉表头
       return dummy.next;
   }
    
   //划分合并区间函数
   ListNode divideMerge(ArrayList<ListNode> lists, int left, int right){
       if(left > right)
           return null;
       //中间一个的情况
       else if(left == right)
           return lists.get(left);
       //从中间分成两段，再将合并好的两段合并
       int mid = (left + right) / 2;
       return Merge(divideMerge(lists, left, mid), divideMerge(lists, mid + 1, right));
   }
    
   public ListNode mergeKLists(ArrayList<ListNode> lists) {
       //k个链表归并排序
       return divideMerge(lists, 0, lists.size() - 1);
   }
```

-   时间复杂度：O(nlog2k)
-   空间复杂度：O(log2k)

上述代码中的Merge()方法，可以直接用来对两个有序链表进行合并。
