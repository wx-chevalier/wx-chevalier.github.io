
---
title: Compiler-CheatSheet
linktitle: Compiler-CheatSheet
type: book
commentable: true
---

# Compiler CheatSheet | 编译原理概览

Compiler theory is the theory of writing compilers (or more generally, translators); programs which translate a program written in one language into another form. The actions of a compiler are traditionally broken up into syntax analysis (scanning and parsing), semantic analysis (determining what a program should do), optimization (improving the performance of a program as indicated by some metric; typically execution speed) and code generation (generation and output of an equivalent program in some target language; often the instruction set of a CPU).

词法分析，将 SQL 字符串拆分成包含关键词识别的字符段（Tokens）。
语法分析，利用自顶向下或自底向上的算法，将 Tokens 解析为 AST，可以手动，也可以自动。
错误检测、恢复、提示推断，都需要利用语法分析产生的 AST。
语义分析，做完这一步就可以执行 SQL 语句了，不过对前端而言，不需要深入到这一步，可以跳过。

词法分析阶段，能够根据输入的字符流能够识别出符号的含义，它们所包含的关键字、数字、字符串、分隔符、数字等。

     词法分析阶段以后，就是把对应的输出作为语法分析。语法分析的作用就是把从词法分析识别出的符号流中识别出符合编程语言语法的语句。语法分析的结果以树型结构保存，称之为语法树。语法树承载了源程序的全部信息，后续的转换工作就与源程序无关了。

    在当前，我们有很多不同的硬件平台，intel、ARM、PowerPC，以及32位和64位等等，为了能够把我们的程序更好的在不同硬件平台上运行，编译器把语法树先转换为一个通用的，抽象的“CPU指令”，这就是中间代码最初的设计思路，然后根据具体选定的CPU，将中间代码落实到具体CPU的目标代码。

     选定具体CPU，操作系统后，中间代码就转换为目标代码--汇编代码。然后汇编器依照选定操作系统的目标文件格式，将汇编文件转换为具体的目标文件。对于linux而言是.o文件，window系统是.obj文件。目标文件已经是选定CPU的机器指令了。

     最后一步就是链接器把一个或多个目标文件链接成符合操作系统指定格式的可执行文件。通过操作系统，可执行程序就可以被载入内存执行了。

1、词法分析
编译器将源码看作一个很长的字符串，首先对它进行从左到右的扫描，然后对其做初步分析，识别出代码中的单词（称作 Token），分为基本字、标识符、常数、运算符和界符等，方便编译的后续步骤。

        在该过程中如果发现不符合词法规则的token，将做出错处理。

2、语法分析
语法分析是对词法分析得到的单词流，按语法规则做进一步的分析，识别出语法单位，如表达式、短语、子句、句子和程序等，从而形成一颗“语法树”。

       在该过程中如果发现不符合语法规则的单词流，将做出错处理。

3、语义分析
经过词法分析和语法分析，程序如果没有错误，就可以按照语义要求对其进行“翻译”，形成被称为“四元式”的中间代码。

4、优化
语义分析生成的中间代码不依赖于实际的硬件，便于优化和移植，针对实际状况做一些等效变换，使程序占用内存更小，执行更快。

5、目标代码生成
根据优化后的中间代码，可生成有效的目标代码。而通常编译器将其翻译为汇编代码，此时还需要将汇编代码经汇编器汇编为目标机器的机器语言。

6、出错处理
编译的各个阶段都有可能发现源码中的错误，尤其是语法分析阶段可能会发现大量的错误，因此编译器需要做出错处理，报告错误类型及错误位置等信息。

![image](https://user-images.githubusercontent.com/5803001/44029860-7870c4a6-9f31-11e8-8cee-c0ac7c53264f.png)

编译
前端（平台无关）
词法分析：形象点说就是扫描器，将字符识别为有意义的记号：关键字、标识符、字面量（数字、字符串）、操作符等，顺便将标示符放到符号表，数字、字符串放到文字表等，链接阶段要用。
语法分析：对每个表达式构造语法树-操作符在父节点上，左右操作数在左右孩子上。
语义分析：语法对不代表这句话有意义，不过这阶段只能做静态语义分析，给每个语法树节点标上类型，静态类型检查、类型转换等都是在这个阶段完成。
看完数学之美会知道，自然语言处理已经放弃了语义分析这些传统方法，转而采用统计学方法，一大原因就是自然语言是上下文相关的，而人类发明的高级语言是上下文无关的。
源代码优化：将语法树用 三地址码（x = y OP z）等格式表达，容易做优化，优化的代码包括常量相加之类。
后端（平台相关）
汇编语言生成：将中间代码转化为汇编指令。
汇编指令优化：比如用移位代替乘法等。
汇编
这项工作比较简单，将汇编指令转化为机器指令，参考汇编指令与机器指令对照表一对一翻译。
最终获得的文件称为可重定位或共享目标文件。

# Links

    