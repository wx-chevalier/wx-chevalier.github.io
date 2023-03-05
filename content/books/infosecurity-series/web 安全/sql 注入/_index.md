
---
title: SQL 注入
linktitle: SQL 注入
type: book
commentable: true
---

# SQL 注入

攻击者在 HTTP 请求中注入恶意的 SQL 代码，服务器使用参数构建数据库 SQL 命令时，恶意 SQL 被一起构造，并在数据库中执行。
用户登录，输入用户名 test，密码 `'or '1'='1`，如果此时使用参数构造的方式，就会出现：

```sql
select * from user where name = 'zach' and password = '' or '1'='1'
```

不管用户名和密码是什么内容，使查询出来的用户列表不为空。其防护手段主要为：

- Web 端进行有效性检验，限制字符串输入的长度。
- 服务端不用拼接 SQL 字符串，使用预编译的 PrepareStatement，进行有效性检验，过滤 SQL 需要的参数中的特殊字符，比如单引号、双引号等。

# Links

- https://www.zhihu.com/question/335706717/answer/756929373

    