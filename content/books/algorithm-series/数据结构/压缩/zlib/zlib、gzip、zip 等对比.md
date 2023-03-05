
---
title: zlib、gzip、zip 等对比
linktitle: zlib、gzip、zip 等对比
type: book
commentable: true
---

# zlib、gzip、zip 等对比

先来看一下 zlib，它的官方网站是www.zlib.net，目前的最新版本是1.2.11.官方介绍它是一个免费的数据压缩库（A Massively Spiffy Yet Delicately Unobtrusive Compression Library），zlib 由两位主要人员开发，Jean-loup Gailly 负责压缩功能，Mark Adler 负责解压功能。由于代码是开源的，我们不妨把源码下载下来，编译一下,编译之后我们在 zlib 的安装目录看到了下列文件:

```s
[root@iZrj9hu97fjb3e1xlfktg8Z zlib]# tree
.
├── include
│   ├── zconf.h
│   └── zlib.h
├── lib
│   ├── libz.a
│   ├── libz.so -> libz.so.1.2.11
│   ├── libz.so.1 -> libz.so.1.2.11
│   ├── libz.so.1.2.11
│   └── pkgconfig
│       └── zlib.pc
└── share
    └── man
        └── man3
            └── zlib.3
6 directories, 8 files
```

仔细观察的话，发现 zlib 并没有像其它的程序一样，编译出二进制可指定代码，只有头文件，库文件和文档，也就是说 zlib 并不提供对文件的直接操作。再来会过来头看 zlib 源代码的 zlib.3.pdf 文件，它是这样说的：“zlib 库是一个通用的数据压缩库，它提供在内存当中的压缩和解压算法，目前只支持 deflation 一种算法，将来可能会添加其它压缩算法”，也就是说整个 zlib 实际上只有一种算法，那就是 deflation 算法。zlib 提供了几个比较简单的函数来压缩和解压数据:

```c
int ZEXPORT compress2 (dest, destLen, source, sourceLen, level)
    Bytef *dest;
    uLongf *destLen;
    const Bytef *source;
    uLong sourceLen;
    int level;
{
    z_stream stream;
    int err;
    const uInt max = (uInt)-1;
    uLong left;
    left = *destLen;
    *destLen = 0;
    stream.zalloc = (alloc_func)0;
    stream.zfree = (free_func)0;
    stream.opaque = (voidpf)0;
    err = deflateInit(&stream, level);
    if (err != Z_OK) return err;
    stream.next_out = dest;
    stream.avail_out = 0;
    stream.next_in = (z_const Bytef *)source;
    stream.avail_in = 0;
    do {
        if (stream.avail_out == 0) {
            stream.avail_out = left > (uLong)max ? max : (uInt)left;
            left -= stream.avail_out;
        }
        if (stream.avail_in == 0) {
            stream.avail_in = sourceLen > (uLong)max ? max : (uInt)sourceLen;
            sourceLen -= stream.avail_in;
        }
        err = deflate(&stream, sourceLen ? Z_NO_FLUSH : Z_FINISH);
    } while (err == Z_OK);
    *destLen = stream.total_out;
    deflateEnd(&stream);
    return err == Z_STREAM_END ? Z_OK : err;
}
int ZEXPORT compress (dest, destLen, source, sourceLen)
    Bytef *dest;
    uLongf *destLen;
    const Bytef *source;
    uLong sourceLen;
{
    return compress2(dest, destLen, source, sourceLen, Z_DEFAULT_COMPRESSION);
}
```

通过参数，我们可以看到 zlib 的压缩确实像上面说的，没有涉及到文件操作，不读取硬盘上的数据文件进行压缩，只操作内存数据。那么我们来测试一下用 compress 函数压缩数据:

```c
#include <stdio.h>
#include <string.h>
#include <zlib.h>
#include <stdlib.h>
int my_write(char* fname,const char * buffer);
int main(int argc,char** argv){
    if(argc == 1){
        printf("Please Input A String You want to Compress\n");
        return -1;
    }
    char * str = argv[1];
    printf("The String You Want to Compress is: %s\n",str);
    //计算需要压缩的字符的长度
    uLong sLen = strlen(str);
    //压缩之后字符的长度
    uLong tLen;
    //通过zlib API计算tlen的长度，以便接下来给压缩之后的数据分配空间
    tLen = compressBound(sLen);
    //分配压缩数据空间
    char * cspace;
    cspace = malloc(tLen);
    //是否分配成功
    if(cspace == NULL){
        printf("Not enough memory!\n");
        return -1;
    }
    //开始压缩
    int result;
    result = compress(cspace,&tLen,str,sLen);
    if(result == Z_OK){
        printf("Compress Sucess!\n");
        //保存压缩内容到硬盘
        int j = my_write("compressdata.bin",cspace);
        if(j==0){
            printf("\t-Sucess to write into disk!\n");
        }else{
            printf("\t-Failure to write into disk!\n");
        }
    }
    //开始解压
    result = uncompress(str,&sLen,cspace,tLen);
    if(result == Z_OK){
        printf("Original String is: %s\n",str);
    }else{
        printf("uncompress failure!\n");
    }
    free(cspace);
    return 0;
}
int my_write(char* fname,const char * buffer)
{
    size_t writesize;
    FILE *pFile;
    pFile = fopen(fname,"wb");
    //fwrite返回区块数量
    writesize = fwrite(buffer,strlen(buffer),1,pFile);
    fclose(pFile);
    if(strlen(buffer)>0 && 1 == writesize){
        return 0;
    }else{
        return 1;
    }
}
```

编译运行:

```c
[root@iZrj9hu97fjb3e1xlfktg8Z ~]# gcc zcompress.c  -I /tmp/zlib/include/ -lz -L /tmp/zlib/lib/ -o z
[root@iZrj9hu97fjb3e1xlfktg8Z ~]# ./z "This is the string"
The String You Want to Compress is: This is the string
Compress Sucess!
	-Sucess to write into disk!
Original String is: This is the string
```

到这里一切正常，那是不是 zlib 提供就是 deflation 算法呢？实则不然，zlib 还提供了一种 zlib 数据格式，在原有压缩数据的基础上，添加头部和尾部信息，在 HTTP/1.1 协议中，content-encoding 类型中的 deflate，实际上不是 deflation 算法处理的原始数据，而是添加了头部和尾部信息的 ZLIB 格式。ZLIB 的头部和尾部数据信息可以查看 rfc1950。

那么 gzip 和 zlib 又有什么区别呢，在 gzip 的说明文档中，看到了这样的文字:

```s
The deflation algorithm used by zip and gzip is a variation of LZ77
(Lempel-Ziv 1977, see reference below). It finds duplicated strings in
the input data. The second occurrence of a string is replaced by a
pointer to the previous string, in the form of a pair (distance,
length). Distances are limited to 32K bytes, and lengths are limited
to 258 bytes. When a string does not occur anywhere in the previous
32K bytes, it is emitted as a sequence of literal bytes. (In this
description, ‘string’ must be taken as an arbitrary sequence of bytes,
and is not restricted to printable characters.)

… 2. gzip file format

The pkzip format imposes a lot of overhead in various headers, which
are useful for an archiver but not necessary when only one file is
compressed. gzip uses a much simpler structure. Numbers are in little
endian format, and bit 0 is the least significant bit.
A gzip file is a sequence of compressed members. Each member has the
following structure:

2 bytes magic header 0x1f, 0x8b (\037 \213)
1 byte compression method (0..7 reserved, 8 = deflate)
1 byte flags
bit 0 set: file probably ascii text
bit 1 set: continuation of multi-part gzip file
bit 2 set: extra field present
bit 3 set: original file name present
bit 4 set: file comment present
bit 5 set: file is encrypted
bit 6,7: reserved
4 bytes file modification time in Unix format
1 byte extra flags (depend on compression method)
1 byte operating system on which compression took place

2 bytes optional part number (second part=1)
2 bytes optional extra field length
? bytes optional extra field
? bytes optional original file name, zero terminated
? bytes optional file comment, zero terminated
12 bytes optional encryption header
? bytes compressed data
4 bytes crc32
4 bytes uncompressed input size modulo 2^32
```

也就是说 gzip 也是使用 deflation 算法进行数据的压缩，只是存储格式和不一样，另外 gzip 只能处理当个文件，然 zip 格式则可以处理目录。综上：

1，zlib 提供一系列函数库，可以采用 deflation 算法对数据进行压缩，还提供 ZLIB DATA FORMAT 的跨平台的数据格式。
2，gzip 是一个采用 deflation 算法处理文件的工具，提供比较小的头部和尾部信息，只支持处理单个文件。
3，zip 的压缩算法也是采用 deflation，它能够处理多个文件或者目录。
4，HTTP 协议中的传输编码 deflate，传输的数据不是经过 deflation 压缩的数据，而是 zlib 格式的数据，即在压缩的基础上，增加 zlib 头和尾数据。

    