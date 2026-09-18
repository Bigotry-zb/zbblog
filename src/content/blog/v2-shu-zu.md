---
title: "v2-数组"
description: "定义： 数组是存放在连续内存空间上的相同类型数据的集合。"
pubDate: "2022-10-08 16:44:00"
categories: ["算法"]
tags: ["java","数组"]
draft: false
---
# 一、理论基础

定义：**数组是存放在连续内存空间上的相同类型数据的集合。**

需要注意两点：

-   数组下标从0开始
-   数组内存空间的地址是连续的

针对二维数组在内存空间的地址是否连续，不同的编程语言的内存管理不同。在C++中二维数组是连续分布的。但在java中二维数组不是连续分布的。

java中的二维数组可能是如下排列方式：

![](/images/hexo/2022/10/08/v2-shu-zu/image-20221008165054951.png)

基本方法：

```java
int[] nums = new int[n];
int len = nums.length;    // 长度
nums[i];  // 取值
```

# 二、经典题目（力扣、牛客

## 1、704.二分查找

二分查找的前提条件是数组有序，同时还要保证数组无重复元素，因为若是有重复元素，二分查找返回来的索引可能不是唯一的。二分查找需要注意的地方是边界问题，一旦确定好边界，都要按这个规则来，一会是左闭右闭一会是左闭右开，当然绕！

所以若是看到数组有序且无重复，可以联想二分查找

二分查找两种写法：

-   左闭右闭即\[left, right\]
-   左闭右开即\[left, right)

### 1、左闭右闭

定义 target 是在一个在左闭右闭的区间里，**也就是\[left, right\]** 。

-   while (left <= right) 要使用 <= ，因为left == right是有意义的，所以使用 <=
-   if (nums\[middle\] > target) right 要赋值为 middle - 1，同样if (nums\[middle\] < target) left要赋值为 middle + 1。因为是左闭右闭，所以middle一定已经判断过了，直接跳过即可

### 2、左闭右开

定义 target 是在一个在左闭右闭的区间里，**也就是\[left, right）** 。

-   while (left <= right) 要使用 < ，因为left == right是没有有意义的，所以不能使用<=，要使用<
-   if (nums\[middle\] > target) right 要赋值为 middle， if (nums\[middle\] < target) left要赋值为 middle + 1。

二者选一个即可，我个人倾向于左闭右闭

### 3、相关题目推荐

-   [35.搜索插入位置(opens new window)](https://programmercarl.com/0035.%E6%90%9C%E7%B4%A2%E6%8F%92%E5%85%A5%E4%BD%8D%E7%BD%AE.html)
-   [34.在排序数组中查找元素的第一个和最后一个位置(opens new window)](https://programmercarl.com/0034.%E5%9C%A8%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E6%9F%A5%E6%89%BE%E5%85%83%E7%B4%A0%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%92%8C%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E4%BD%8D%E7%BD%AE.html)
-   69.x 的平方根
-   367.有效的完全平方数

## 2、27.移除元素

题目要求不能使用额外的数组空间，意味着只能原地操作

两种方法

### 1、暴力法

for循环两次，碰到目标值，就将后面的各个元素往前移动一位

当然时间复杂度比较高，O(n\*2)

### 2、双指针法

维持两个指针，一个快一个慢，for循环一次，若不为目标值，将fast所在位置的元素赋值给slow所在位置的元素，同时往后进一位

代码如下：

```java
for (fast = 0; fast < nums.length; fast++) {
   if(nums[fast] != val) {
       nums[slow++] = nums[fast];
   }
}
```

### 3、相关题目推荐

-   26.删除排序数组中的重复项
-   283.移动零
-   844.比较含退格的字符串
-   977.有序数组的平方

## 3、209.长度最小的子数组

三种方法

### 1、暴力法

两层for循环，每遍历一个，就向后相加找到大于target的索引并记录，同时保留一个res来记录最小值

当然时间复杂度是比较高的，O(n\*2)

### 2、滑动窗口

定义两个指针start和end，并记录sum，若是sum < target，就将end往后++；若是sum >= target，就将start++，并对sum和size做相应操作

代码如下：

```java
while (end < nums.length) {
     sum += nums[end];
     while (sum >= target) {
     min = Math.min(min, end - start + 1);
        sum -= nums[start];
        start++;
     }
     end++;
}
```

### 3、相关题目推荐

-   [904.水果成篮(opens new window)](https://leetcode.cn/problems/fruit-into-baskets/)
-   \==[76.最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)\==【经典】

### 4、滑动窗口总结

滑动窗口有最小滑动窗口模板和最大滑动窗口模板，具体要求看题目要求

最小滑动窗口模板：

```java
while (j < len){
    判断[i, j]是否满足条件
    while (满足条件){
        不断更新结果(注意在while内更新！)
        i += 1 （最大程度的压缩i，使得滑窗尽可能的小）
    }
    j += 1
}
```

如：

```java
while (end < nums.length) {
     sum += nums[end];
     while (sum >= target) {
     min = Math.min(min, end - start + 1);
        sum -= nums[start];
        start++;
     }
     end++;
}
```

代表题目为209

最大滑动窗口模板：

```java
while (j < len){
    判断[i, j]是否满足条件
    while (不满足条件){
        i += 1 （最大程度的压缩i，使得滑窗尽可能的小）
    }
    不断更新结果(注意在while内更新！)
    j += 1
}
```

如：

```java
while (right < fruits.length) {
    map.put(fruits[right], map.getOrDefault(fruits[right], 0) + 1);
    while (map.size() > 2) {
    // count为水果最大数目，当map大小超过2时，滑窗需前移left;
       map.put(fruits[left], map.get(fruits[left]) - 1);
       if (map.get(fruits[left]) == 0) {
            map.remove(fruits[left]);
       }
       left++;
    }
    count = Math.max(count, right - left + 1);
    right++;
}
```

代表题目为904

## 4、59.螺旋矩阵II

正确解决二分法是坚持循环不变量原则，这道题也是一样，要么一直左闭右开，要么一直左闭右闭。

模拟顺时针画矩阵的过程:

-   填充上行从左到右
-   填充右列从上到下
-   填充下行从右到左
-   填充左列从下到上

由此可见，需要定义的变量有：

1.  返回的数组
2.  循环次数，每一环为一次，定义这个的目的是控制边界，因为有的时候需要赋值n-1次，有的时候需要赋值n-2次，这个时候就要用到循环次数
3.  定义起始变量start，每循环一圈就令start++
4.  定义全局变量i, j

### 相关题目推荐

-   54.螺旋矩阵
-   剑指Offer 29.顺时针打印矩阵

## 5、二位数组中的查找（牛客

题目链接：[二位数组中的查找](https://www.nowcoder.com/practice/abc3fe2ce8e146608e868a70efebf62e?tpId=295&tags=&title=&difficulty=0&judgeStatus=0&rp=0&sourceUrl=%2Fexam%2Foj)

### 1、方法一

直接二维循环暴力，不多赘述

### 2、方法二

可以发现，只有当前行有一个元素大于目标值，那么该元素后面的和下面的就不用看了，也肯定大于元素。相当于暴力法的剪枝操作。

代码如下：

```java
public boolean Find(int target, int [][] array) {
    // 剪枝    
    int col = array[0].length;
        for (int i = 0; i < array.length; i++) {
            for (int j = 0; j < col; j++) {
                if (array[i][j] == target)
                    return true;
                if (array[i][j] > target && col == 0)
                    return false;
                if (array[i][j] > target) {
                    col = j;
                    break;
                }
            }
        }
        return false;
    }
```

### 3、方法三

首先看四个角，左上与右下必定为最小值与最大值，而左下与右上就有规律了：**左下元素大于它上方的元素，小于它右方的元素，右上元素与之相反**。既然左下角元素有这么一种规律，相当于将要查找的部分分成了一个大区间和小区间，每次与左下角元素比较，我们就知道目标值应该在哪部分中，于是可以利用分治思维来做。

首先以左下角为起点，若是它小于目标元素，则往右移动去找大的，若是他大于目标元素，则往上移动去找小的。若是移动到了矩阵边界也没找到，说明矩阵中不存在目标值。

代码如下：

```java
public boolean Find(int target, int [][] array) {
        //优先判断特殊
        if(array.length == 0) 
            return false;
        int n = array.length;
        if(array[0].length == 0) 
            return false;
        int m = array[0].length;
        //从最左下角的元素开始往左或往上
        for(int i = n - 1, j = 0; i >= 0 && j < m; ){
            //元素较大，往上走
            if(array[i][j] > target)  
                i--;
            //元素较小，往右走
            else if(array[i][j] < target)
                j++;
            else
                return true;
        }
        return false;
    }
```
