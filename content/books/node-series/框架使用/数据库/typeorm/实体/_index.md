
---
title: 实体
linktitle: 实体
type: book
commentable: true
---

# 实体

# 实体定义

实体是一个映射到数据库表（或使用 MongoDB 时的集合）的类。你可以通过定义一个新类来创建一个实体，并用 @Entity() 来标记：

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;
}
```

这将创建以下数据库表：

```s
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| firstName   | varchar(255) |                            |
| lastName    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

基本实体由列和关系组成。每个实体必须有一个主列（如果使用 MongoDB，则为 ObjectId 列）。每个实体都必须在连接选项中注册：

```ts
const connection: Connection = await createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: [User]
  // 指定包含所有实体的整个目录，该目录下所有实体都将被加载
  // entities: ["entity/*.js"]
});
```

如果要为 User 实体使用替代表名，可以在 @Entity 中指定：`@Entity（“my_users”`）。如果要为应用程序中的所有数据库表设置基本前缀，可以在连接选项中指定 entityPrefix。

# 实体列

由于数据库表由列组成，因此实体也必须由列组成。标有 @Column 的每个实体类属性都将映射到数据库表列。

## 主列

每个实体必须至少有一个主列。有几种类型的主要列：

- @PrimaryColumn() 创建一个主列，它可以获取任何类型的任何值。你也可以指定列类型。如果未指定列类型，则将从属性类型自动推断。

- @PrimaryGeneratedColumn() 创建一个主列，该值将使用自动增量值自动生成。它将使用 auto-increment /serial /sequence 创建 int 列（取决于数据库）。你不必在保存之前手动分配其值，该值将会自动生成。

- @PrimaryGeneratedColumn("uuid") 创建一个主列，该值将使用 uuid 自动生成。Uuid 是一个独特的字符串 id。你不必在保存之前手动分配其值，该值将自动生成。

你也可以拥有复合主列：

```ts
@Entity()
export class User {
  @PrimaryColumn()
  firstName: string;

  @PrimaryColumn()
  lastName: string;
}
```

当您使用 save 保存实体时，它总是先尝试使用给定的实体 ID（或 ids）在数据库中查找实体。如果找到 id/ids，则将更新数据库中的这一行。如果没有包含 id/ids 的行，则会插入一个新行。要通过 id 查找实体，可以使用 `manager.findOne`或 repository.findOne。例：

```ts
// 使用单个主键查找一个id
const person = await connection.manager.findOne(Person, 1);
const person = await connection.getRepository(Person).findOne(1);

// 使用复合主键找到一个id
const user = await connection.manager.findOne(User, {
  firstName: "Timber",
  lastName: "Saw"
});
const user = await connection
  .getRepository(User)
  .findOne({ firstName: "Timber", lastName: "Saw" });
```

## 列类型

TypeORM 支持所有最常用的数据库支持的列类型。列类型是特定于数据库类型的 - 这为数据库架构提供了更大的灵活性。你可以将列类型指定为@ Column 的第一个参数 或者在@Column 的列选项中指定，例如：

```ts
@Column("int")

@Column({ type: "int" })

@Column("varchar", { length: 200 })

@Column({ type: "int", length: 200 })
```

- mysql/mariadb 的列类型: int, tinyint, smallint, mediumint, bigint, float, double, dec, decimal, numeric, date, datetime, timestamp, time, year, char, varchar, nvarchar, text, tinytext, mediumtext, blob, longtext, tinyblob, mediumblob, longblob, enum, json, binary, geometry, point, linestring, polygon, multipoint, multilinestring, multipolygon, geometrycollection

有几种特殊的列类型可以使用：

- @CreateDateColumn 是一个特殊列，自动为实体插入日期。无需设置此列，该值将自动设置。

- @UpdateDateColumn 是一个特殊列，在每次调用实体管理器或存储库的 save 时，自动更新实体日期。无需设置此列，该值将自动设置。

- @VersionColumn 是一个特殊列，在每次调用实体管理器或存储库的 save 时自动增长实体版本（增量编号）。无需设置此列，该值将自动设置。

## enum 列类型

postgres 和 mysql 都支持 enum 列类型。并有多种列定义方式：

```ts
// 使用 typescript 枚举
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  GHOST = "ghost"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.GHOST
  })
  role: UserRole;
}

// 使用带枚举值的数组
export type UserRoleType = "admin" | "editor" | "ghost",

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ["admin", "editor", "ghost"],
        default: "ghost"
    })
    role: UserRoleType
}
```

## simple-array 的列类型

有一种称为 simple-array 的特殊列类型，它可以将原始数组值存储在单个字符串列中。所有值都以逗号分隔。例如：

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-array")
  names: string[];
}

const user = new User();
user.names = ["Alexander", "Alex", "Sasha", "Shurik"];
```

存储在单个数据库列中的 Alexander，Alex，Sasha，Shurik 值。当你从数据库加载数据时，name 将作为 names 数组返回，就像之前存储它们一样。

## simple-json 列类型

还有一个名为`simple-json`的特殊列类型，它可以存储任何可以通过 JSON.stringify 存储在数据库中的值当你的数据库中没有 json 类型而你又想存储和加载对象，该类型就很有用了例如:

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-json")
  profile: { name: string; nickname: string };
}
const user = new User();
user.profile = { name: "John", nickname: "Malkovich" };
```

存储在单个数据库列中的`{“name”：“John”，“nickname”：“Malkovich”}`值 当你从数据库加载数据时，将通过 JSON.parse 返回 object/array/primitive。

# 嵌入式实体

通过使用 embedded columns，可以减少应用程序中的重复（使用组合而不是继承）。嵌入列是一个列，它接受具有自己列的类，并将这些列合并到当前实体的数据库表中。例如:假设我们有 User，Employee 和 Student 实体。这些属性都有少量的共同点，first name 和 last name 属性。我们可以做的是通过创建一个包含 firstName 和 lastName 的新类：

```ts
import { Entity, Column } from "typeorm";

export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}
```

然后"connect"实体中的这些列：

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Name } from "./Name";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column(type => Name)
  name: Name;

  @Column()
  isActive: boolean;
}
```

Name 实体中定义的所有列将合并为 user，employee 和 student：

```s
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| nameFirst   | varchar(255) |                            |
| nameLast    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

# 实体继承

你可以使用实体继承模式减少代码中的重复最简单和最有效的是具体的表继承。所有这些实体都有共同的列：`id`，`title`，`description`为了减少重复并产生更好的抽象，我们可以为它们创建一个名为 `Content` 的基类：

```typescript
export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}

@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}
```

    