
---
title: KMP
linktitle: KMP
type: book
commentable: true
---

# KMP 算法

# KMP: O(M+N)

基本的匹配算法是需要 `N*M` 次比较，而我们希望从主串的 i 点开始比较，向后比较了 k 个字符时失败，那么下一次匹配的时候我们是否需要从 i+1 开始重新匹配？答案是否定的，我们的 next 函数就是寻找下个匹配的开始位置。假设我们在 i+k1 处能够匹配成功，可知 findStr.substring(0,k) == findStr.substring(j - k,j)，反过来，我们就需要寻找满足 findStr.substring(0,k) == findStr.substring(j - k,j)的 k 值，也就是我们在 findStr 下标 j 处失败时应该重新开始匹配的点。在 KMP 算法中我们会使用 i,j 两个指针，其中 i 会指向当前主串匹配到的位置，j 指向模式串匹配到的位置，其中 i 是只会增加的，即每次重新匹配时 i 要么不变，要么加 1。而 j 则根据模式串自身计算出的 next 向量的对应值，在每次重新匹配时动态设置。当我们在进行匹配时，假设在匹配字串 originStr 下标 i，模式串 findStr 下标 j 处失败，可以得到如下处理：(1)如果 j == 0，即在第一个字符处匹配失败，则设置 i = i + 1，j = 0 进行新一轮匹配。(2)如果 j > 0，那么假设下一轮匹配在 originStr 下标 i，findStr 下标 k 处开始，显而易见可以得到 k < j 并且 findStr.substring(0,k) == findStr.substring(j - k,j)，就如下图所示：

换言之，当我们需要计算在 i，j 处匹配失败之后下一轮开始的下标时，如果 findStr.substring(0,k) == findStr.substring(j - k,j)，并且 j > k 时，我们就需要将 下一轮的开始的 j 进行如下赋值：j = k。这里的 k，即是我们编程时通过计算得到的 next 数组中所指示的值。综上所述，KMP 算法的核心即是计算字符串 findStr 每一个位置之前的字符串的前缀和后缀公共部分的最大长度(不包括字符串本身，否则最大长度始终是字符串本身)。获得 findStr 每一个位置的最大公共长度之后，就可以利用该最大公共长度快速和字 符串 originStr 比较。当每次比较到两个字符串的字符不同时，我们就可以根据最大公共长度将字符串 findStr 向前移动(已匹配长度-最大公共长度)位，接着继续比较下一个位 置。事实上，字符串 findStr 的前移只是概念上的前移，只要我们在比较的时候从最大公共长度之后比较 findStr 和 originStr 即可达到字符串 f 前移的目的。

## next 计算

![](http://img.blog.csdn.net/20130924000843031)

理解了 kmp 算法的基本原理，下一步就是要获得字符串 f 每一个位置的最大公共长度。这个最大公共长度在算法导论里面被记为 next 数组。在这里要注意一点，next 数组表示的是长度，下标从 1 开始；但是在遍历原字符串时，下标还是从 0 开始。假设我们现在已经求得 next[1]、next[2]、……next[i]，分别表示长度为 1 到 i 的字符串的前缀和后缀最大公共长度，现在要求 next[i+1]。由上图我们可以看到，如果位置 i 和位置 next[i]处的两个字符相同(下标从零开始)，则 next[i+1]等于 next[i]加 1。如果两个位置的字符不相同，我们可以将长度为 next[i]的字符串继续分割，获得其最大公共长度 next[next[i]]，然后再和位置 i 的字符比较。这是因为长度为 next[i]前缀和后缀都可以分割成上部的构造，如果位置 next[next[i]]和位置 i 的字符相同，则 next[i+1]就等于 next[next[i]]加 1。如果不相等，就可以继续分割长度为 next[next[i]]的字符串，直到字符串长度为 0 为止。由此我们可以写出求 next 数组的代码(java 版)：

```java
public static int[] getNext(String findStr) {

    //模式字符串的长度
    int len = findStr.length();

    int j = 0;

    //next表示长度为i的字符串前缀和后缀的最长公共部分，从1开始
    //next[1]表示长度为1的字符串前缀和后缀的最长公共部分,也就是在字符串下标1处匹配失败所需要回退到的位置
    int next[] = new int[len + 1];

    //初始化前两个数值为0
    next[0] = next[1] = 0;

    //从字符串下标1开始匹配
    //ababcd
    for (int i = 1; i < len; i++) {
        //在第 i 次循环中,我们计算的是 next[i + 1]的值,因为在考虑 i + 1位置时,需要将第 i 个字符进行考虑
        //j在每次循环开始都表示next[i]的值，同时也表示需要比较的下一个位置
        while (j > 0 &&
                //直到找到离起点最近的一个与i字符相等的下标
                findStr.charAt(i) != findStr.charAt(j)
                ) {
            //不断分割子字符串
            //以abcdcabcd为例,next[7] = 2,这样就找到了离起点最近的那个c
            j = next[j];
        }

        //如果第 i 个字符与第 j 个字符相等,则把长度加1
        //这个if是判断第一个字符串与第i个字符串是否相等,相等的话还是要加1的
        //在j>0的情况下,这个是必然相等的
        if (findStr.charAt(i) == findStr.charAt(j)) j++;

        //将当前选定的j赋值给next[i+1]
        next[i + 1] = j;
    }

    return next;
}
```

# Links

- [字符串模式匹配——KMP 算法(时间复杂度为 O(m+n))](http://blog.sina.com.cn/s/blog_70bab9230101g0qv.html)

    