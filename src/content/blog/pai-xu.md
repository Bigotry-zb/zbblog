---
title: "排序"
description: "排序算法分为内部排序和外部排序，内部排序把数据记录放在内存中进行排序，而外部排序因排序的数据量大，内存不能一次容纳全部的排序记录，所以在排序过程中需要访问外存。"
pubDate: "2023-03-08 13:09:00"
categories: ["算法"]
tags: ["java","排序"]
draft: false
---
排序算法分为内部排序和外部排序，内部排序把数据记录放在内存中进行排序，而外部排序因排序的数据量大，内存不能一次容纳全部的排序记录，所以在排序过程中需要访问外存。

![](/images/hexo/2023/03/08/pai-xu/image-20230308131907550.png)

## 1、冒泡排序

### 1、算法描述

冒泡排序算法的算法过程如下：

1.  比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2.  对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3.  针对所有的元素重复以上的步骤，除了最后一个。
4.  持续每次对越来越少的元素重复上面的步骤①~③，直到没有任何一对数字需要比较

### 2、代码实现

```java
public class BubbleSort {
    public static void sort(int[] array) {
        if (array == null || array.length == 0) {
            return;
        }

        int length = array.length;
        //外层：需要length-1次循环比较
        for (int i = 0; i < length - 1; i++) {
            //内层：每次循环需要两两比较的次数，每次比较后，都会将当前最大的数放到最后位置，所以每次比较次数递减一次
            for (int j = 0; j < length - 1 - i; j++) {
                if (array[j] > array[j+1]) {
                    //交换数组array的j和j+1位置的数据
                    swap(array, j, j+1);
                }
            }
        }
    }

    /**
     * 交换数组array的i和j位置的数据
     * @param array 数组
     * @param i 下标i
     * @param j 下标j
     */
    public static void swap(int[] array, int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
```

### 3、算法效率

冒泡排序稳定

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(n2) | O(n) | O(n2) | O(1) |

### 4、扩展（数组交换三种方法）

```java
/**
    * 通过临时变量交换数组array的i和j位置的数据
    * @param array 数组
    * @param i 下标i
    * @param j 下标j
    */
public static void swapByTemp(int[] array, int i, int j) {
       int temp = array[i];
       array[i] = array[j];
       array[j] = temp;
   }

   /**
    * 通过算术法交换数组array的i和j位置的数据（有可能溢出）
    * @param array 数组
    * @param i 下标i
    * @param j 下标j
    */
   public static void  swapByArithmetic(int[] array, int i, int j) {
       array[i] = array[i] + array[j];
       array[j] = array[i] - array[j];
       array[i] = array[i] - array[j];
   }

   /**
    * 通过位运算法交换数组array的i和j位置的数据
    * @param array 数组
    * @param i 下标i
    * @param j 下标j
    */
   public static void  swapByBitOperation(int[] array, int i, int j) {
       array[i] = array[i]^array[j];
       array[j] = array[i]^array[j]; //array[i]^array[j]^array[j]=array[i]
       array[i] = array[i]^array[j]; //array[i]^array[j]^array[i]=array[j]
   }
```

## 2、快速排序

### 1、算法描述

快速排序使用分治策略来把一个序列（list）分为两个子序列（sub-lists）。步骤为：

1.  从数列中挑出一个元素，称为”基准”（pivot）。
2.  重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
3.  递归地（recursively）把小于基准值元素的子数列和大于基准值元素的子数列排序。

递归到最底部时，数列的大小是零或一，也就是已经排序好了。这个算法一定会结束，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。

### 2、代码实现

（1）low = L; high = R; 选取a\[low\]作为关键字记录为key。

（2）high–，由后向前找比它小的数

（3）low++，由前向后找比它大的数

（4）交换第（2）、（3）步找到的数

（5）重复（2）、（3），一直往后找，直到left和right相遇，这时将key和a\[low\]交换位置。

```java
public class QuickSort {
    /**
     * 快速排序（左右指针法）
     * @param arr 待排序数组
     * @param low 左边界
     * @param high 右边界
     */
    public static void sort2(int arr[], int low, int high) {
        if (arr == null || arr.length <= 0) {
            return;
        }
        if (low >= high) {
            return;
        }

        int left = low;
        int right = high;

        int key = arr[left];

        while (left < right) {
            while (left < right && arr[right] >= key) {
                right--;
            }
            while (left < right && arr[left] <= key) {
                left++;
            }
            if (left < right) {
                swap(arr, left, right);
            }
        }
        swap(arr, low, left);
        System.out.println("Sorting: " + Arrays.toString(arr));
        sort2(arr, low, left - 1);
        sort2(arr, left + 1, high);
    }

    public static void swap(int arr[], int low, int high) {
        int tmp = arr[low];
        arr[low] = arr[high];
        arr[high] = tmp;
    }
}
```

### 3、算法效率

快排不稳定

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(nlogn) | O(nlogn) | O(n2) | O(1) |

## 3、直接插入排序

### 1、算法描述

具体算法描述如下：

1.  从第一个元素开始，该元素可以认为已经被排序
2.  取出下一个元素，在已经排序的元素序列中从后向前扫描
3.  如果该元素（已排序）大于新元素，将该元素移到下一位置
4.  重复步骤3，直到找到已排序的元素小于或者等于新元素的位置
5.  将新元素插入到该位置后
6.  重复步骤2~5

### 2、代码实现

插入过程中将有序序列中比待插入数字大的数据向后移动，由于移动时会覆盖待插入数据，所以需要额外的临时变量保存待插入数据，代码实现如下：

```java
public static void sort(int[] a) {
        if (a == null || a.length == 0) {
            return;
        }

        for (int i = 1; i < a.length; i++) {
            int j = i - 1;
            int temp = a[i]; // 先取出待插入数据保存，因为向后移位过程中会把覆盖掉待插入数
            while (j >= 0 && a[j] > temp) { // 如果待是比待插入数据大，就后移
                a[j+1] = a[j];
                j--;
            }
            a[j+1] = temp; // 找到比待插入数据小的位置，将待插入数据插入
        }
}
```

### 3、算法效率

直接插入排序不稳定

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(n2) | O(n) | O(n2) | O(1) |

## 4、希尔排序

### 1、算法描述

希尔排序是先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。

### 2、代码实现

![](/images/hexo/2023/03/08/pai-xu/image-20230308151749218.png)

```java
public class ShellSort {

    public static void sort(int[] arr) {
        int gap = arr.length / 2;
        for (;gap > 0; gap = gap/2) {
            for (int j = 0; (j + gap) < arr.length; j++) { //不断缩小gap，直到1为止
                for (int k = 0; (k + gap) < arr.length; k+=gap) { //使用当前gap进行组内插入排序
                    if (arr[k] > arr[k+gap]) { //交换操作
                        arr[k] = arr[k] + arr[k+gap];
                        arr[k+gap] = arr[k] - arr[k+gap];
                        arr[k] = arr[k] - arr[k+gap];
                        System.out.println("    Sorting:  " + Arrays.toString(arr));
                    }
                }
            }
        }
    }
}
```

### 3、算法效率

不稳定排序算法，希尔排序第一个突破O(n2)的排序算法；是简单插入排序的改进版；它与插入排序的不同之处在于，它会优先比较距离较远的元素，直接插入排序是稳定的；而希尔排序是不稳定的，希尔排序的时间复杂度和步长的选择有关。

## 5、选择排序

### 1、算法描述

在未排序序列中找到最小（大）元素，存放到未排序序列的起始位置。在所有的完全依靠交换去移动元素的排序方法中，选择排序属于非常好的一种。

1.  从待排序序列中，找到关键字最小的元素；
2.  如果最小元素不是待排序序列的第一个元素，将其和第一个元素互换；
3.  从余下的 N - 1 个元素中，找出关键字最小的元素，重复1、2步，直到排序结束。

### 2、代码实现

```java
public class SelectSort {
    public static void sort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int min = i;
            for (int j = i+1; j < arr.length; j ++) { //选出之后待排序中值最小的位置
                if (arr[j] < arr[min]) {
                    min = j;
                }
            }
            if (min != i) {
                arr[min] = arr[i] + arr[min];
                arr[i] = arr[min] - arr[i];
                arr[min] = arr[min] - arr[i];
            }
        }
    }
```

### 3、算法效率

不稳定排序算法，选择排序的简单和直观名副其实，这也造就了它出了名的慢性子，无论是哪种情况，哪怕原数组已排序完成，它也将花费将近n²/2次遍历来确认一遍。 唯一值得高兴的是，它并不耗费额外的内存空间。

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(n2) | O(n2) | O(n2) | O(1) |

## 6、归并排序

### 1、算法描述

归并排序算法是将两个（或两个以上）有序表合并成一个新的有序表，即把待排序序列分为若干个子序列，每个子序列是有序的。然后再把有序子序列合并为整体有序序列。

1.  将序列每相邻两个数字进行归并操作，形成 floor(n/2)个序列，排序后每个序列包含两个元素；
2.  将上述序列再次归并，形成 floor(n/4)个序列，每个序列包含四个元素；
3.  重复步骤2，直到所有元素排序完毕

### 2、代码实现

```java
import java.util.Arrays;

public class MergeSort {

    public static int[] sort(int [] a) {
        if (a.length <= 1) {
            return a;
        }
        int num = a.length >> 1;
        int[] left = Arrays.copyOfRange(a, 0, num);
        int[] right = Arrays.copyOfRange(a, num, a.length);
        return mergeTwoArray(sort(left), sort(right));
    }

    public static int[] mergeTwoArray(int[] a, int[] b) {
        int i = 0, j = 0, k = 0;
        int[] result = new int[a.length + b.length]; // 申请额外空间保存归并之后数据

        while (i < a.length && j < b.length) { //选取两个序列中的较小值放入新数组
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j++];
            }
        }

        while (i < a.length) { //序列a中多余的元素移入新数组
            result[k++] = a[i++];
        }
        while (j < b.length) {//序列b中多余的元素移入新数组
            result[k++] = b[j++];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] b = {3, 1, 5, 4};
        System.out.println(Arrays.toString(sort(b)));
    }
}
```

### 3、算法效率

归并排序是稳定排序算法，从效率上看，归并排序可算是排序算法中的”佼佼者”。代价是需要额外的内存空间。

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(nlogn) | O(nlogn) | O(nlogn) | O(n) |

## 7、基数排序

### 1、算法描述

基数排序（Radix sort）是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

将所有待比较数值（正整数）统一为同样的数位长度，数位较短的数前面补零。然后，从最低位开始，依次进行一次排序。这样从最低位排序一直到最高位排序完成以后，数列就变成一个有序序列。

基数排序按照优先从高位或低位来排序有两种实现方案：

***MSD（Most significant digital）*** 从最左侧高位开始进行排序。先按k1排序分组, 同一组中记录, 关键码k1相等, 再对各组按k2排序分成子组, 之后, 对后面的关键码继续这样的排序分组, 直到按最次位关键码kd对各子组排序后. 再将各组连接起来, 便得到一个有序序列。MSD方式适用于位数多的序列。

***LSD（Least significant digital）*** 从最右侧低位开始进行排序。先从kd开始排序，再对kd-1进行排序，依次重复，直到对k1排序后便得到一个有序序列。LSD方式适用于位数少的序列。

以LSD为例，从最低位开始，具体算法描述如下：

1.  取得数组中的最大数，并取得位数；
2.  arr为原始数组，从最低位开始取每个位组成radix数组；
3.  对radix进行计数排序（利用计数排序适用于小范围数的特点）；

### 2、代码实现

***基数排序***：通过序列中各个元素的值，对排序的N个元素进行若干趟的“分配”与“收集”来实现排序。

***分配***：我们将L\[i\]中的元素取出，首先确定其个位上的数字，根据该数字分配到与之序号相同的桶中

***收集***：当序列中所有的元素都分配到对应的桶中，再按照顺序依次将桶中的元素收集形成新的一个待排序列L\[\]。对新形成的序列L\[\]重复执行分配和收集元素中的十位、百位…直到分配完该序列中的最高位，则排序结束

```java
import java.util.Arrays;

public class RadixSort {

    public static void main(String[] args) {
        int[] array = {10, 20, 5, 4, 100};
        sort(array);
    }

    public static void sort(int[] a) {
        if (a == null || a.length < 0) {
            return;
        }

        int max = a[0];    // 找最大值
        for (int i = 0; i <a.length; i++) {
            if (a[i] > max) {
                max = a[i];
            }
        }
        System.out.println("max, " + max);

        int maxDigit = 0;  // 最大值的位数
        while (max != 0) {
            max = max / 10;
            maxDigit++;
        }
        System.out.println("maxDigit, " + maxDigit);

        int[][] buckets = new int[10][a.length];
        int base = 10;

        //从低位到高位，对每一位遍历，将所有元素分配到桶中
        for (int i = 0; i < maxDigit; i++) {
            int[] bucketLen = new int[10];  //存储各个桶中存储元素的数量

            //收集：将不同桶里数据挨个捞出来,为下一轮高位排序做准备,由于靠近桶底的元素排名靠前,因此从桶底先捞
            for (int j = 0; j < a.length; j++) {
                int whichBucket = (a[j] % base) / (base / 10);
                buckets[whichBucket][bucketLen[whichBucket]] = a[j];
                bucketLen[whichBucket]++;
            }

            int k = 0;
            //收集：将不同桶里数据挨个捞出来,为下一轮高位排序做准备,由于靠近桶底的元素排名靠前,因此从桶底先捞
            for (int l = 0; l < buckets.length; l++) {
                for (int m =0; m < bucketLen[l]; m++) {
                    a[k++] = buckets[l][m];
                }
            }
            System.out.println("Sorting: " + Arrays.toString(a));
            base *= 10;
        }
    }
}
```

### 3、算法效率

基数排序不改变相同元素之间的相对顺序，因此它是稳定的排序算法，以下是基数排序算法复杂度：

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(d\*(n+r)) | O(d\*(n+r)) | O(d\*(n+r)) | O(n+r) |

其中，d 为位数，r 为基数，n 为原数组个数。在基数排序中，因为没有比较操作，所以在复杂上，最好的情况与最坏的情况在时间上是一致的，均为 O(d\*(n + r))。

基数排序更适合用于对时间, 字符串等这些整体权值未知的数据进行排序，适用于：

-   数据范围较小，建议在小于1000
-   每个数值都要大于等于0

## 8、堆排序

### 1、算法描述

堆： 堆是具有以下性质的完全二叉树，每个结点的值都大于或等于其左右孩子结点的值，称为大顶堆；或者每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆。

![](/images/hexo/2023/03/08/pai-xu/image-20230308155848030.png)

用简单的公式来描述一下堆的定义就是：

大顶堆：arr\[i\] >= arr\[2i+1\] && arr\[i\] >= arr\[2i+2\]

小顶堆：arr\[i\] <= arr\[2i+1\] && arr\[i\] <= arr\[2i+2\]

堆排序的基本思想是：将待排序序列构造成一个大顶堆，此时，整个序列的最大值就是堆顶的根节点。将其与末尾元素进行交换，此时末尾就为最大值。然后将剩余n-1个元素重新构造成一个堆，这样会得到n个元素的次小值。如此反复执行，便能得到一个有序序列了。

简单总结下堆排序的基本思路：

1.  将无序序列构建成一个堆，根据升序降序需求选择大顶堆或小顶堆（一般升序采用大顶堆，降序采用小顶堆);
2.  将堆顶元素与末尾元素交换，将最大元素"沉"到数组末端;
3.  重新调整结构，使其满足堆定义，然后继续交换堆顶元素与当前末尾元素，反复执行调整+交换步骤，直到整个序列有序。

### 2、代码实现

```java
import java.util.Arrays;

public class HeapSort {

    public static void main(String []args){
        int []arr = {4,6,8,5,9};
        sort(arr);
        System.out.println(Arrays.toString(arr));
    }
    
    public static void sort(int []arr){
        //1.构建大顶堆
        for(int i=arr.length/2-1;i>=0;i--){
            //从第一个非叶子结点从下至上，从右至左调整结构
            adjustHeap(arr,i,arr.length);
        }
        //2.调整堆结构+交换堆顶元素与末尾元素
        for(int j=arr.length-1;j>0;j--){
            swap(arr,0,j);//将堆顶元素与末尾元素进行交换
            adjustHeap(arr,0,j);//重新对堆进行调整
        }

    }

    /**
     * 调整大顶堆（仅是调整过程，建立在大顶堆已构建的基础上）
     * @param arr
     * @param i
     * @param length
     */
    public static void adjustHeap(int []arr,int i,int length){
        int temp = arr[i];//先取出当前元素i
        for(int k=i*2+1;k<length;k=k*2+1){//从i结点的左子结点开始，也就是2i+1处开始
            if(k+1<length && arr[k]<arr[k+1]){//如果左子结点小于右子结点，k指向右子结点
                k++;
            }
            if(arr[k] >temp){//如果子节点大于父节点，将子节点值赋给父节点（不用进行交换）
                arr[i] = arr[k];
                i = k;
            }else{
                break;
            }
        }
        arr[i] = temp;//将temp值放到最终的位置
    }

    /**
     * 交换元素
     * @param arr
     * @param a
     * @param b
     */
    public static void swap(int []arr,int a ,int b){
        int temp=arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
}
```

### 3、算法效率

堆排序是不稳定的排序。

-   建立堆的过程, 从length/2 一直处理到0, 时间复杂度为O(n);
-   调整堆的过程是沿着堆的父子节点进行调整, 执行次数为堆的深度, 时间复杂度为O(lgn);
-   堆排序的过程由n次第②步完成, 时间复杂度为O(nlgn)

| 平均时间复杂度 | 最好情况 | 最坏情况 | 空间复杂度 |
| --- | --- | --- | --- |
| O(nlogn) | O(nlogn) | O(nlogn) | O(1) |

## 9、总结

![](/images/hexo/2023/03/08/pai-xu/image-20230308161501298.png)

从时间复杂度来说：

-   平方阶O(n²)排序：各类简单排序：直接插入、直接选择和冒泡排序；
-   线性对数阶O(nlog₂n)排序：快速排序、堆排序和归并排序；
-   O(n1+§))排序，§是介于0和1之间的常数：希尔排序
-   线性阶O(n)排序：基数排序，此外还有桶、箱排序。
