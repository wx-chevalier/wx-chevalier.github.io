
---
title: 所有权系统
linktitle: 所有权系统
type: book
commentable: true
---

# 所有权系统

所有权系统（Ownership System）是 Rust 语言最基本最独特也是最重要的特性之一。Rust 追求的目标是内存安全与运行效率，但是它却没有 Golang, Java, Python 等语言的内存垃圾回收机制 GC。Rust 语言号称，只要编译通过就不会崩溃（内存安全）；拥有着零或者极小的运行时开销（运行效率）。这些优点也都得益于 Rust 的所有权系统。

所有权系统，包括三个重要的组成部分：**Ownership**（所有权），**Borrowing**（借用），**Lifetimes**（生命周期）。

    