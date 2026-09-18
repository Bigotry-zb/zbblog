---
title: "单调栈"
description: "在使用单调栈的时候首先要明确如下几点："
pubDate: "2022-09-16 17:51:00"
categories: ["算法"]
tags: ["java"]
draft: false
---
# 单调栈

在使用单调栈的时候首先要明确如下几点：

1.  单调栈里存放的元素是什么？

单调栈里只需要存放元素的下标i就可以了，如果需要使用对应的元素，直接T\[i\]就可以获取。

1.  单调栈里元素是递增呢？ 还是递减呢？

**注意一下顺序为 从栈头到栈底的顺序**，因为单纯的说从左到右或者从前到后，不说栈头朝哪个方向的话，大家一定会越看越懵。

## 每日温度

思路一：暴力，两层for循环就可以解决问题

思路二：单调栈

**通常是一维数组，要寻找任一个元素的右边或者左边第一个比自己大或者小的元素的位置，此时我们就要想到可以用单调栈了**。

单调栈时间复杂度为O(n)

本题使用栈头到栈尾递增，注意单调栈里面放的是元素的下标i

若是栈尾元素大于等于当前元素，直接进栈；否则栈尾元素小于当前元素的话，先弹出比当前元素小的栈尾（用while判断），再入栈

## 下一个更大元素I

首先想到暴力解法，外层遍历nums1，内层遍历nums2，当然可以，时间复杂度是O(n\*2)

也可使用单调栈

我是这么想的，先用“每日温度”的思路，把nums2寻找右侧第一个比自己大的元素的位置找到，然后再遍历num1。可以一试；NO，到最后给res赋值的时候，找不到nums2的具体位置

```java
if(nums2[i] <= nums2[stack.peek()])    //  小于等于，继续往里放
     stack.push(i);
else {
     while (!stack.isEmpty() && nums2[i] > nums2[stack.peek()]) {
           if (hashMap.containsKey(nums2[stack.peek()])) {
                  Integer index = hashMap.get(nums2[stack.peek()]); //先取出nums2的下标，再赋值给nums1
                  res[index] = nums2[i];
           }
           stack.pop();
     }
     stack.push(i);
}
```

重点是第6、7行的代码

目的是nums1要从nums2中取出数；比如下面的nums\[1\], nums\[1\] = 1,计算nums2中1的右边第一个大的元素，返回的是nums2\[1\]而不是下标1

![image-20220915111659905](https://bigotry-zb.github.io/2022/09/16/dan-diao-zhan/Typora%E6%96%87%E4%BB%B6/Typora%E5%9B%BE%E7%89%87/image-20220915111659905.png)

## 下一个更大元素II

本题加了个循环，个人想法是两遍，数组遍历两遍，当成一个数组来做

确实可以，但是做了无用功，例如扩充数组，扩充数组就不说了，最后还需要将res数组又缩小

卡哥思路：跟上题大体上类似，只不过本题是遍历了2倍的数组，然后循环的时候计算用i%size来计算

这种单调栈，我觉得最重要的是赋值的处理，循环内的关键代码的书写

## 接雨水

三种思路：

一、双指针法

要求雨水，按列来求，雨水的高度等于该列左侧最高高度和右侧最高高度中低的那个，只需要将左右侧低的那个柱子的高度减去当前列柱子的高度，就可求出该列的雨水，然后从0循环，求总和

二、动态规划法

牛蛙牛蛙

动态规划思路和双指针法其实差不多，只不过由于双指针法存在着大量重复的操作，动态规划优化了一下而已

动态规划要求将左侧最高高度和右侧最高高度都保存在对应的一个数组里，如maxleft\[\], maxright\[\]

递推公式：左边的最高高度为上一个的最高高度和当前的高度取最大值，右侧同理

从左向右遍历：maxLeft\[i\] = max(height\[i\], maxLeft\[i - 1\]);

从右向左遍历：maxRight\[i\] = max(height\[i\], maxRight\[i + 1\]);

最后求和

本题动态规划最简单

```java
int[] maxleft = new int[height.length];
int[] maxright = new int[height.length];
int sum = 0;
maxleft[0] = height[0];
maxright[height.length - 1] = height[height.length - 1];
for (int i = 1; i < height.length; i++) {
     maxleft[i] = Math.max(maxleft[i - 1], height[i]);
}
for (int i = height.length - 2; i >= 0; i--) {
     maxright[i] = Math.max(maxright[i + 1], height[i]);
}
for (int i = 0; i < height.length; i++) {
     int area = Math.min(maxleft[i], maxright[i]) - height[i];
     if (area > 0)
          sum += area;
}
return sum;
```

三、单调栈法

单调栈法比较难理解，单调栈法是维持栈内从栈头到栈尾从小到大的顺序排列，一旦发现新入栈的元素值大于栈顶元素，就弹出栈顶元素，此时栈顶元素就是底部，再弹出栈顶元素，栈顶元素就是左侧柱子，新入栈的元素就是右侧柱子；

思路有了，其中还有一些小细节。

求雨水的高度就是长乘宽，长是高度，宽是右侧与左侧柱子之间的距离，相加。

> 关键代码：

```java
while (!stack.isEmpty() && height[i] > height[stacktop]) {
     int bottom = stack.pop();    //先把底柱的编号取出
     if (!stack.isEmpty()) {   //若是栈不为空的话，进行操作
          int min = Math.min(height[i], height[stack.peek()]);    //取出左边和右边的最小值，注意左柱为弹出
          int area = (min - height[bottom]) * (i - stack.peek() - 1);  // 求面积
          if (area > 0)
                sum += area;
          stacktop = stack.peek();   //注意：左柱并没有弹出，而是更新栈顶元素，接着判断，因为是while
     }
}
stack.push(i);   //最后再将当前元素进栈，进行下一次循环
```

## 柱状图中最大的矩形

感觉这类题动态规划可能好一点？

本题跟接雨水那道题类似，只不过本题换成了求当前柱子左右两边第一个小于该柱子的柱子

还有一个区别，是本题要记录下标，而不是高度

> 思路一：动态规划

动态规划主要体现在求两侧第一个小于该柱子的柱子上

-   求左侧：  
    从0开始遍历，使用一个变量t来记录，碰到大的，再往左走；碰到小的直接赋值
-   求右侧：  
    从length-2开始遍历，跟求左侧一样

最后求和，求最大

> 思路二：单调栈

也能成功AC，但是很明显，单调栈的用时更长

维持一个栈头到栈尾由大到小的栈，若是遇到当前元素大于栈头元素的，直接进栈；等于也是直接进栈；当前元素小于栈头元素的，那么当前栈顶元素就是底柱，栈顶弹出后，当前元素的栈顶是左柱，i是右柱；即可求出面积，并同求最大值。

但是需要数组扩容，两边同时扩一下；可能是为了防止i = 1的时候前面没有元素可弹出现栈溢出的错误吧。
