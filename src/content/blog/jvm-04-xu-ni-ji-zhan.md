---
title: "JVM-04-虚拟机栈"
description: ""
pubDate: "2022-10-31 17:02:00"
categories: ["JVM"]
tags: ["java","JVM"]
draft: false
---
## 1、虚拟机栈概述

### 1、虚拟机栈的出现背景

1.  由于跨平台性的设计，Java的指令都是根据栈来设计的。不同平台CPU架构不同，所以不能设计为基于寄存器的【如果设计成基于寄存器的，耦合度高，性能会有所提升，因为可以对具体的CPU架构进行优化，但是跨平台性大大降低】。
2.  优点是跨平台，指令集小，编译器容易实现，缺点是性能下降，实现同样的功能需要更多的指令

### 2、内存中的栈和堆

1.  首先栈是运行时的单位，而堆是存储的单位。
2.  即：栈解决程序的运行问题，即程序如何执行，或者说如何处理数据。堆解决的是数据存储的问题，即数据怎么放，放哪里

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031170753668.png)

### 3、虚拟机栈基本内容

> Java虚拟机栈是什么？

Java虚拟机栈（Java Virtual Machine Stack），早期也叫Java栈。每个线程在创建时都会创建一个虚拟机栈，其内部保存一个个的栈帧（Stack Frame），**对应着一次次的Java方法调用**，栈是线程私有的

```java
public class StackTest {

    public static void main(String[] args) {
        StackTest test = new StackTest();
        test.methodA();
    }

    public void methodA() {
        int i = 10;
        int j = 20;

        methodB();
    }

    public void methodB(){
        int k = 30;
        int m = 40;
    }
}
```

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031171651921.png)

> 虚拟机栈的生命周期

生命周期和线程一致，也就是线程结束了，该虚拟机栈也销毁了

> 虚拟机栈的作用

主管Java程序的运行，它保存方法的局部变量（8 种基本数据类型、对象的引用地址）、部分结果，并参与方法的调用和返回。

局部变量，它是相比于成员变量来说的（或属性）

基本数据类型变量 VS 引用类型变量（类、数组、接口）

### 4、虚拟机栈的特点

-   栈是一种快速有效的分配存储方式，访问速度仅次于程序计数器。
-   JVM直接对Java栈的操作只有两个：
    -   每个方法执行，伴随着**进栈**（入栈、压栈）
    -   执行结束后的**出栈**工作
-   对于栈来说不存在垃圾回收问题
    -   栈不需要GC，但是可能存在OOM（异常）

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031171930120.png)

### 5、虚拟机栈的异常

栈中可能出现哪些异常？

-   Java 虚拟机规范允许Java栈的大小是动态的或者是固定不变的。
    -   如果采用固定大小的Java虚拟机栈，那每一个线程的Java虚拟机栈容量可以在线程创建的时候独立选定。如果线程请求分配的栈容量超过Java虚拟机栈允许的最大容量，Java虚拟机将会抛出一个**StackoverflowError** 异常。（栈溢出）
    -   如果Java虚拟机栈可以动态扩展，并且在尝试扩展的时候无法申请到足够的内存，或者在创建新的线程时没有足够的内存去创建对应的虚拟机栈，那Java虚拟机将会抛出一个 **OutofMemoryError** 异常。（内存溢出）

### 6、设置栈内存大小

> 官方文档：[https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-3B1CE181-CD30-4178-9602-230B800D4FAE)

可以使用参数 **\-Xss** 选项来设置线程的最大栈空间，栈的大小直接决定了函数调用的最大可达深度。

The following examples set the thread stack size to 1024 KB in different units:

```java
-Xss1m
-Xss1024k
-Xss1048576
```

### 举例

```java
public class StackErrorTest {
    private static int count = 1;
    public static void main(String[] args) {
        System.out.println(count);
        count++;
        main(args);
    }
}
```

没设置参数前的部分结果：

```java
11404
11405
11406
Exception in thread "main" java.lang.StackOverflowError
at sun.nio.cs.UTF_8$Encoder.encodeLoop(UTF_8.java:691)
```

说明栈在11406这个深度溢出了

设置栈参数后，（可参考[Idea调节栈参数](https://www.jianshu.com/p/909a906ec14b)）

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031181051063.png)

部分输出结果：

```java
2474
2475
2476
Exception in thread "main" java.lang.StackOverflowError
at sun.nio.cs.UTF_8.updatePositions(UTF_8.java:77)
```

## 2、栈的存储单位

### 1、栈中存储什么

-   每个线程都有自己的栈，栈中的数据都是以**栈帧**（Stack Frame）的格式存在
-   在这个线程上正在执行的`每个方法都各自对应一个栈帧`（Stack Frame）。
-   栈帧是一个内存区块，是一个数据集，维系着方法执行过程中的各种数据信息。

### 2、栈运行原理

-   JVM直接对Java栈的操作只有两个，就是对栈帧的**压栈和出栈**，遵循先进后出（后进先出）原则
-   在一条活动线程中，一个时间点上，只会有一个活动的栈帧。即只有当前正在执行的方法的栈帧（栈顶栈帧）是有效的。这个栈帧被称为**当前栈帧（Current Frame）**，与当前栈帧相对应的方法就是**当前方法（Current Method）**，定义这个方法的类就是**当前类（Current Class）**
-   执行引擎运行的所有字节码指令只针对当前栈帧进行操作。
-   如果在该方法中调用了其他方法，对应的新的栈帧会被创建出来，放在栈的顶端，成为新的当前帧。

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031181732230.png)

1.  **不同线程中所包含的栈帧是不允许存在相互引用的**，即不可能在一个栈帧之中引用另外一个线程的栈帧。栈是各自私有的。
    
2.  如果当前方法调用了其他方法，方法返回之际，当前栈帧会传回此方法的执行结果给前一个栈帧，接着，虚拟机会丢弃当前栈帧，使得前一个栈帧重新成为当前栈帧。
    
3.  Java方法有两种返回函数的方式。
    
    -   一种是正常的函数返回，使用return指令。
    -   另一种是方法执行中出现未捕获处理的异常，以抛出异常的方式结束。
    
    但不管使用哪种方式，都会导致栈帧被弹出。
    

### 3、栈帧的内部结构

每个栈帧中存储着：

-   `局部变量表（Local Variables）`
-   `操作数栈（Operand Stack）（或表达式栈）`
-   动态链接（Dynamic Linking）（或指向运行时常量池的方法引用）
-   方法返回地址（Return Address）（或方法正常退出或者异常退出的定义）
-   一些附加信息

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031183936694.png)

并行每个线程下的栈都是私有的，因此每个线程都有自己各自的栈，并且每个栈里面都有很多栈帧，栈帧的大小主要由局部变量表 和 操作数栈决定的

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031184012273.png)

## 3、局部变量表

### 1、局部变量表

1.  局部变量表也被称之为局部变量数组或本地变量表
2.  **定义为一个数字数组，主要用于存储方法参数和定义在方法体内的局部变量**，这些数据类型包括各类基本数据类型、对象引用（reference），以及returnAddress返回值类型。
3.  由于局部变量表是建立在线程的栈上，是线程的私有数据，因此**不存在数据安全问题**
4.  **局部变量表所需的容量大小是在编译期确定下来的**，并保存在方法的Code属性的**maximum local variables**数据项中。在方法运行期间是不会改变局部变量表的大小的。
5.  方法嵌套调用的次数由栈的大小决定。一般来说，栈越大，方法嵌套调用次数越多。
    -   对一个函数而言，它的参数和局部变量越多，使得局部变量表膨胀，它的栈帧就越大，以满足方法调用所需传递的信息增大的需求。
    -   进而函数调用就会占用更多的栈空间，导致其嵌套调用次数就会减少。
6.  局部变量表中的变量只在当前方法调用中有效。
    -   在方法执行时，虚拟机通过使用局部变量表完成参数值到参数变量列表的传递过程。
    -   当方法调用结束后，随着方法栈帧的销毁，局部变量表也会随之销毁。

下面是一个例子：

```java
public class LocalVariablesTest {
    private int count = 0;

    public static void main(String[] args) {
        LocalVariablesTest test = new LocalVariablesTest();
        int num = 10;
        test.test1();
    }

    //练习：
    public static void testStatic(){
        LocalVariablesTest test = new LocalVariablesTest();
        Date date = new Date();
        int count = 10;
        System.out.println(count);
        //因为this变量不存在于当前方法的局部变量表中！！
//        System.out.println(this.count);
    }

    //关于Slot的使用的理解
    public LocalVariablesTest(){
        this.count = 1;
    }

    public void test1() {
        Date date = new Date();
        String name1 = "atguigu.com";
        test2(date, name1);
        System.out.println(date + name1);
    }

    public String test2(Date dateP, String name2) {
        dateP = null;
        name2 = "songhongkang";
        double weight = 130.5;//占据两个slot
        char gender = '男';
        return dateP + name2;
    }

    public void test3() {
        this.count++;
    }

    public void test4() {
        int a = 0;
        {
            int b = 0;
            b = a + 1;
        }
        //变量c使用之前已经销毁的变量b占据的slot的位置
        int c = a + 1;
    }
}
```

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031190546496.png)

看完字节码后，可得结论：局部变量表所需的容量大小是在`编译期`确定下来的。

用jclasslib来看字节码，以main方法为例来讲解。

1、0-15 也就是有16行字节码

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031191240599.png)

2、方法异常信息表

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031191307715.png)

3、Misc

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031191327591.png)

4、行号表

Java代码的行号和字节码指令行号的对应关系

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031191415540.png)

5、注意：生效行数和剩余有效行数都是针对于字节码文件的行数

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221031191440509.png)

1、图中圈的东西表示该局部变量的作用域

2、Start PC==11表示在字节码的11行开始生效，也就是Java代码对应的第15行。而声明int num在java代码的是第14行，说明是从声明的下一行开始生效

3、Length== 5表示局部变量剩余有效行数，main方法字节码指令总共有16行，从11行开始生效，那么剩下就是16-11 ==5。

4、`Ljava/lang/String` 前面的L表示引用类型

### 2、关于slot

-   参数值的存放总是从局部变量数组索引 0 的位置开始，到数组长度-1的索引结束。
-   局部变量表，**最基本的存储单元是Slot（变量槽）**，局部变量表中存放编译期可知的各种基本数据类型（8种），引用类型（reference），returnAddress类型的变量。
-   在局部变量表里，32位以内的类型只占用一个slot（包括returnAddress类型），64位的类型占用两个slot（1ong和double）。
    -   byte、short、char在储存前被转换为int，boolean也被转换为int，0表示false，非0表示true
    -   long和double则占据两个slot
-   JVM会为局部变量表中的每一个Slot都分配一个访问索引，通过这个索引即可成功访问到局部变量表中指定的局部变量值
-   当一个实例方法被调用的时候，它的方法参数和方法体内部定义的局部变量将会**按照顺序被复制**到局部变量表中的每一个slot上
-   如果需要访问局部变量表中一个64bit的局部变量值时，只需要使用前一个索引即可。（比如：访问long或double类型变量）
-   如果当前帧是由构造方法或者实例方法创建的，那么**该对象引用this将会存放在index为0的slot处**，其余的参数按照参数表顺序继续排列。（this也相当于一个变量）

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101155101775.png)

### 3、slot代码示例

**this 存放在 index = 0 的位置**

```java
public void test3() {
       this.count++;
   }
```

局部变量表：this 存放在 index = 0 的位置

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101161423898.png)

**64位的类型（1ong和double）占用两个slot**

```java
public String test2(Date dateP, String name2) {
      dateP = null;
      name2 = "songhongkang";
      double weight = 130.5;//占据两个slot
      char gender = '男';
      return dateP + name2;
  }
```

weight 为 double 类型，index 直接从 3 蹦到了 5

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101161537765.png)

### 4、slot的重复使用

栈帧中的局部变量表中的槽位是可以重用的，如果一个局部变量过了其作用域，那么在其作用域之后申明新的局部变量变就很有可能会复用过期局部变量的槽位，从而达到节省资源的目的。

```java
public void test4() {
    int a = 0;
    {
        int b = 0;
        b = a + 1;
    }
    //变量c使用之前已经销毁的变量b占据的slot的位置
    int c = a + 1;
}
```

局部变量c重用了局部变量b的slot位置

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101161714299.png)

### 5、静态变量与局部变量的对比

java变量的分类：  
1、按照数据类型分：① 基本数据类型 ② 引用数据类型  
2、按照在类中声明的位置分：  
2-1、成员变量：在使用前，都经历过默认初始化赋值  
2-1-1、类变量: linking的prepare阶段：给类变量默认赋值  
—> initial阶段：给类变量显式赋值即静态代码块赋值  
2-1-2、实例变量：随着对象的创建，会在堆空间中分配实例变量空间，并进行默认赋值  
2-2、局部变量：在使用前，必须要进行显式赋值的！否则，编译不通过。

-   参数表分配完毕之后，再根据方法体内定义的变量的顺序和作用域分配。
-   我们知道成员变量有两次初始化的机会\*\*，\*\*第一次是在“准备阶段”，执行系统初始化，对类变量设置零值，另一次则是在“初始化”阶段，赋予程序员在代码中定义的初始值。
-   和类变量初始化不同的是，**局部变量表不存在系统初始化的过程**，这意味着一旦定义了局部变量则必须人为的初始化，否则无法使用。

1.  在栈帧中，`与性能调优关系最为密切的部分就是前面提到的局部变量表`。在方法执行时，虚拟机使用局部变量表完成方法的传递。
2.  `局部变量表中的变量也是重要的垃圾回收根节点，只要被局部变量表中直接或间接引用的对象都不会被回收`

## 4、操作数栈

### 1、操作数栈

1.  每一个独立的栈帧除了包含局部变量表以外，还包含一个后进先出（Last - In - First -Out）的 操作数栈，也可以称之为**表达式栈**（Expression Stack）
    
2.  操作数栈，在方法执行过程中，**根据字节码指令，往栈中写入数据或提取数据**，即入栈（push）和 出栈（pop）
    
    -   某些字节码指令将值压入操作数栈，其余的字节码指令将操作数取出栈。使用它们后再把结果压入栈。
        
    -   比如：执行复制、交换、求和等操作
        

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101162841002.png)

### 2、操作数栈作用

1.  操作数栈，**主要用于保存计算过程的中间结果，同时作为计算过程中变量临时的存储空间**。
2.  操作数栈就是JVM执行引擎的一个工作区，当一个方法刚开始执行的时候，一个新的栈帧也会随之被创建出来，这时方法的操作数栈是空的。
3.  每一个操作数栈都会拥有一个明确的栈深度用于存储数值，其所需的最大深度在编译期就定义好了，保存在方法的Code属性中，为**maxstack**的值。
4.  栈中的任何一个元素都是可以任意的Java数据类型
    -   32bit的类型占用一个栈单位深度
    -   64bit的类型占用两个栈单位深度
5.  操作数栈并非采用访问索引的方式来进行数据访问的，而是只能通过标准的入栈和出栈操作来完成一次数据访问。**只不过操作数栈是用数组这个结构来实现的而已**
6.  如果被调用的方法带有返回值的话，其返回值将会被压入当前栈帧的操作数栈中，并更新PC寄存器中下一条需要执行的字节码指令。
7.  操作数栈中元素的数据类型必须与字节码指令的序列严格匹配，这由编译器在编译器期间进行验证，同时在类加载过程中的类检验阶段的数据流分析阶段要再次验证。
8.  另外，**我们说Java虚拟机的解释引擎是基于栈的执行引擎，其中的栈指的就是操作数栈**。

## 5、代码追踪

```java
public void testAddOperation() {
       //byte、short、char、boolean：都以int型来保存
       byte i = 15;
       int j = 8;
       int k = i + j;

      // int m = 800;

   }
```

字节码指令：

```java
 0 bipush 15
 2 istore_1
 3 bipush 8
 5 istore_2
 6 iload_1
 7 iload_2
 8 iadd
 9 istore_3
10 return
```

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101164637529.png)

1、执行第一条语句，PC寄存器指向的是0，也就是指令地址为0，然后使用bipush让操作数15入操作数栈。

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101164809868.png)

2、执行完后，PC寄存器往下移，指向下一行代码，下一行代码就是将操作数栈的元素存储到局部变量表1的位置（istore\_1），可以看到局部变量表的已经增加了一个元素。并且操作数栈为空了

> 为什么局部变量表索引从 1 开始，是因为该方法为实例方法，局部变量表索引为 0 的位置存放的是 this

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101164929145.png)

3、PC下移，指向下一行。操作数8也入栈，同时执行store操作，存入局部变量表中

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101165011427.png)

4、然后从局部变量表中，依次将数据放在操作数栈中，等待执行 add 操作

iload\_1：取出局部变量表中索引为1的数据入操作数栈

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101165030381.png)

5、将操作数栈的两个元素相加，并存储在局部变量表3的位置

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101165049259.png)

**类型转换问题**

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101170200451.png)

因为 8 可以存放在 byte 类型中，所以压入操作数栈的类型为 byte ，而不是 int ，所以执行的字节码指令为 bipush 8。但是存储在局部变量的时候，会转成 int 类型的变量：istore\_4

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101170304921.png)

m改成800之后，byte存储不了，就成了short型，sipush 800

**如果被调用的方法带有返回值，返回值入操作数栈**

```java
public int getSum(){
      int m = 10;
      int n = 20;
      int k = m + n;
      return k;
  }

  public void testGetSum(){
      //获取上一个栈桢返回的结果，并保存在操作数栈中
      int i = getSum();
      int j = 10;
  }
```

getSum() 方法字节码指令：最后带着个 ireturn

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101170433423.png)

testGetSum() 方法字节码指令：一上来就加载 getSum() 方法的返回值()

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101170531591.png)

## 6、栈顶缓存技术(可能未实现？)

**栈顶缓存技术：Top Of Stack Cashing**

1.  前面提过，基于栈式架构的虚拟机所使用的`零地址指令`更加紧凑，但完成一项操作的时候必然需要使用更多的入栈和出栈指令，这同时也就意味着将需要更多的指令分派（instruction dispatch）次数（也就是你会发现指令很多）和导致内存读/写次数多，效率不高。
2.  由于操作数是存储在内存中的，因此频繁地执行内存读/写操作必然会影响执行速度。为了解决这个问题，HotSpot JVM的设计者们提出了栈顶缓存（Tos，Top-of-Stack Cashing）技术，**将栈顶元素全部缓存在物理CPU的寄存器中，以此降低对内存的读/写次数，提升执行引擎的执行效率。**
3.  寄存器的主要优点：指令更少，执行速度快，但是指令集（也就是指令种类）很多

## 7、动态链接

**动态链接（或指向运行时常量池的方法引用）**

-   每一个栈帧内部都包含**一个指向运行时常量池中该栈帧所属方法的引用**。包含这个引用的目的就是**为了支持当前方法的代码能够实现动态链接**（Dynamic Linking），比如：invokedynamic指令
-   在Java源文件被编译到字节码文件中时，所有的变量和方法引用都作为符号引用（Symbolic Reference）保存在class文件的常量池里。比如：描述一个方法调用了另外的其他方法时，就是通过常量池中指向方法的符号引用来表示的，那么**动态链接的作用就是为了将这些符号引用转换为调用方法的直接引用**

```java
public class DynamicLinkingTest {

    int num = 10;

    public void methodA(){
        System.out.println("methodA()....");
    }

    public void methodB(){
        System.out.println("methodB()....");

        methodA();

        num++;
    }

}
```

对应的字节码：

```java
Classfile /F:/IDEAWorkSpaceSourceCode/JVMDemo/out/production/chapter05/com/atguigu/java1/DynamicLinkingTest.class
  Last modified 2020-11-10; size 712 bytes
  MD5 checksum e56913c945f897c7ee6c0a608629bca8
  Compiled from "DynamicLinkingTest.java"
public class com.atguigu.java1.DynamicLinkingTest
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #9.#23         // java/lang/Object."<init>":()V
   #2 = Fieldref           #8.#24         // com/atguigu/java1/DynamicLinkingTest.num:I
   #3 = Fieldref           #25.#26        // java/lang/System.out:Ljava/io/PrintStream;
   #4 = String             #27            // methodA()....
   #5 = Methodref          #28.#29        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #6 = String             #30            // methodB()....
   #7 = Methodref          #8.#31         // com/atguigu/java1/DynamicLinkingTest.methodA:()V
   #8 = Class              #32            // com/atguigu/java1/DynamicLinkingTest
   #9 = Class              #33            // java/lang/Object
  #10 = Utf8               num
  #11 = Utf8               I
  #12 = Utf8               <init>
  #13 = Utf8               ()V
  #14 = Utf8               Code
  #15 = Utf8               LineNumberTable
  #16 = Utf8               LocalVariableTable
  #17 = Utf8               this
  #18 = Utf8               Lcom/atguigu/java1/DynamicLinkingTest;
  #19 = Utf8               methodA
  #20 = Utf8               methodB
  #21 = Utf8               SourceFile
  #22 = Utf8               DynamicLinkingTest.java
  #23 = NameAndType        #12:#13        // "<init>":()V
  #24 = NameAndType        #10:#11        // num:I
  #25 = Class              #34            // java/lang/System
  #26 = NameAndType        #35:#36        // out:Ljava/io/PrintStream;
  #27 = Utf8               methodA()....
  #28 = Class              #37            // java/io/PrintStream
  #29 = NameAndType        #38:#39        // println:(Ljava/lang/String;)V
  #30 = Utf8               methodB()....
  #31 = NameAndType        #19:#13        // methodA:()V
  #32 = Utf8               com/atguigu/java1/DynamicLinkingTest
  #33 = Utf8               java/lang/Object
  #34 = Utf8               java/lang/System
  #35 = Utf8               out
  #36 = Utf8               Ljava/io/PrintStream;
  #37 = Utf8               java/io/PrintStream
  #38 = Utf8               println
  #39 = Utf8               (Ljava/lang/String;)V
{
  int num;
    descriptor: I
    flags:

  public com.atguigu.java1.DynamicLinkingTest();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: bipush        10
         7: putfield      #2                  // Field num:I
        10: return
      LineNumberTable:
        line 7: 0
        line 9: 4
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      11     0  this   Lcom/atguigu/java1/DynamicLinkingTest;

  public void methodA();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #4                  // String methodA()....
         5: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 12: 0
        line 13: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  this   Lcom/atguigu/java1/DynamicLinkingTest;

  public void methodB();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=3, locals=1, args_size=1
         0: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #6                  // String methodB()....
         5: invokevirtual #5                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: aload_0
         9: invokevirtual #7                  // Method methodA:()V
        12: aload_0
        13: dup
        14: getfield      #2                  // Field num:I
        17: iconst_1
        18: iadd
        19: putfield      #2                  // Field num:I
        22: return
      LineNumberTable:
        line 16: 0
        line 18: 8
        line 20: 12
        line 21: 22
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      23     0  this   Lcom/atguigu/java1/DynamicLinkingTest;
}
SourceFile: "DynamicLinkingTest.java"
```

1、在字节码指令中，methodB() 方法中通过 invokevirtual #7 指令调用了方法 A ，那么 #7 是个啥呢？

2、往上面翻，找到常量池的定义：`#7 = Methodref #8.#31`

-   先找 #8 ：
    -   `#8 = Class #32` ：去找 #32
    -   `#32 = Utf8 com/atguigu/java1/DynamicLinkingTest`
    -   结论：通过 #8 我们找到了 `DynamicLinkingTest` 这个类
-   再来找 #31：
    -   `#31 = NameAndType #19:#13` ：去找 #19 和 #13
    -   `#19 = Utf8 methodA` ：方法名为 methodA
    -   `#13 = Utf8 ()V` ：方法没有形参，返回值为 void

3、结论：通过 #7 我们就能找到需要调用的 methodA() 方法，并进行调用

4、在上面，其实还有很多符号引用，比如 Object、System、PrintStream 等等

![](/images/hexo/2022/10/31/jvm-04-xu-ni-ji-zhan/image-20221101190630536.png)

**为什么要用常量池呢？**

1.  因为在不同的方法，都可能调用常量或者方法，所以只需要存储一份即可，然后记录其引用即可，节省了空间。
2.  常量池的作用：就是为了提供一些符号和常量，便于指令的识别
