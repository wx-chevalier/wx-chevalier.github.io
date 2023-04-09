
---
title: Java 构建工具对比
linktitle: Java 构建工具对比
type: book
commentable: true
---

# Java 构建工具对比

在 Linux C 开发中我们常常使用 Make 进行构建，不过 Make 将自己和操作系统绑定在一起了；也就是说，使用 Make，就不能实现(至少很难)跨平台的构建，这对于 Java 来说是非常不友好的。此外，Makefile 的语法也成问题，很多人抱怨 Make 构建失败的原因往往是一个难以发现的空格或 Tab 使用错误。而在 Java 发展过程中常见的自动化构建工具以 Ant、Maven、Gradle 为代表，整个自动化流程往往包含以下步骤：编译源代码、运行单元测试和集成测试、执行静态代码分析、生成分析报告、创建发布版本、部署到目标环境、部署传递过程以及执行冒烟测试和自动功能测试。

和 Make 一样，Ant 也都是过程式的，开发者显式地指定每一个目标，以及完成该目标所需要执行的任务。针对每一个项目，开发者都需要重新编写这一过程，这里其实隐含着很大的重复。Maven 是声明式的，项目构建过程和过程各个阶段所需的工作都由插件实现，并且大部分插件都是现成的，开发者只需要声明项目的基本元素，Maven 就执行内置的、完整的构建过程。这在很大程度上消除了重复。

此外，Ant 是没有依赖管理的，所以很长一段时间 Ant 用户都不得不手工管理依赖，这是一个令人头疼的问题。幸运的是，Ant 用户现在可以借助 Ivy 管理依赖。而对于 Maven 用户来说，依赖管理是理所当然的，Maven 不仅内置了依赖管理，更有一个可能拥有全世界最多 Java 开源软件包的中央仓库，Maven 用户无须进行任何配置就可以直接享用。

而 Gradle 抛弃了 Maven 的基于 XML 的繁琐配置；众所周知 XML 的阅读体验比较差，对于机器来说虽然容易识别，但毕竟是由人去维护的。取而代之的是 Gradle 采用了领域特定语言 Groovy 的配置，大大简化了构建代码的行数。Maven 的设计核心 Convention Over Configuration 被 Gradle 更加发扬光大，而 Gradle 的配置即代码又超越了 Maven。在 Gradle 中任何配置都可以作为代码被执行的，我们也可以随时使用已有的 Ant 脚本(Ant task 是 Gradle 中的一等公民)、Java 类库、Groovy 类库来辅助完成构建任务的编写。在[《Java-Series](https://github.com/wx-chevalier/Java-Series?q=)》系列文章中也有专门的章节讲解 Gradle，笔者在 Android 与 Spring 项目构建中也会优先选择 Gradle。

# Ant with Ivy

Ant 是第一个“现代”构建工具，在很多方面它有些像 Make。2000 年发布，在很短时间内成为 Java 项目上最流行的构建工具。它的学习曲线很缓，因此不需要什么特殊的准备就能上手。它基于过程式编程的 idea。在最初的版本之后，逐渐具备了支持插件的功能。主要的不足是用 XML 作为脚本编写格式。XML，本质上是层次化的，并不能很好地贴合 Ant 过程化编程的初衷。Ant 的另外一个问题是，除非是很小的项目，否则它的 XML 文件很快就大得无法管理。后来，随着通过网络进行依赖管理成为必备功能，Ant 采用了 Apache Ivy。

Ant 的主要优点在于对构建过程的控制上。Ivy 的依赖需要在 ivy.xml 中指定。我们的例子很简单，只需要依赖 JUnit 和 Hamcrest。

```xml
<ivy-module version="2.0">
    <info organisation="org.apache" module="java-build-tools"/>
    <dependencies>
        <dependency org="junit" name="junit" rev="4.11"/>
        <dependency org="org.hamcrest" name="hamcrest-all" rev="1.3"/>
    </dependencies>
</ivy-module>
```

现在我们来创建 Ant 脚本，任务只是编译一个 Jar 文件。最终文件是下面的 build.xml。

```xml
<project xmlns:ivy="antlib:org.apache.ivy.ant" name="java-build-tools" default="jar">

    <property name="src.dir" value="src"/>
    <property name="build.dir" value="build"/>
    <property name="classes.dir" value="${build.dir}/classes"/>
    <property name="jar.dir" value="${build.dir}/jar"/>
    <property name="lib.dir" value="lib" />
    <path id="lib.path.id">
        <fileset dir="${lib.dir}" />
    </path>

    <target name="resolve">
        <ivy:retrieve />
    </target>

    <target name="clean">
        <delete dir="${build.dir}"/>
    </target>

    <target name="compile" depends="resolve">
        <mkdir dir="${classes.dir}"/>
        <javac srcdir="${src.dir}" destdir="${classes.dir}" classpathref="lib.path.id"/>
    </target>

    <target name="jar" depends="compile">
        <mkdir dir="${jar.dir}"/>
        <jar destfile="${jar.dir}/${ant.project.name}.jar" basedir="${classes.dir}"/>
    </target>

</project>
```

首先，我们设置了几个属性，然后是一个接一个的 task。我们用 Ivy 来处理依赖，清理，编译和打包，这是几乎所有的 Java 项目都会进行的 task，配置有很多。

运行 Ant task 来生成 Jar 文件，执行下面的命令。

```
ant jar
```

# Maven

Maven 发布于 2004 年。目的是解决码农使用 Ant 所带来的一些问题。Maven 仍旧使用 XML 作为编写构建配置的文件格式，但是，文件结构却有巨大的变化。Ant 需要码农将执行 task 所需的全部命令都一一列出，然而 Maven 依靠约定(convention)并提供现成的可调用的目标(goal)。不仅如此，有可能最重要的一个补充是，Maven 具备从网络上自动下载依赖的能力(Ant 后来通过 Ivy 也具备了这个功能)，这一点革命性地改变了我们开发软件的方式。

但是，Maven 也有它的问题。依赖管理不能很好地处理相同库文件不同版本之间的冲突(Ivy 在这方面更好一些)。XML 作为配置文件的格式有严格的结构层次和标准，定制化目标(goal)很困难。因为 Maven 主要聚焦于依赖管理，实际上用 Maven 很难写出复杂、定制化的构建脚本，甚至不如 Ant。用 XML 写的配置文件会变得越来越大，越来越笨重。在大型项目中，它经常什么“特别的”事还没干就有几百行代码。

Maven 的主要优点是生命周期。只要项目基于一定之规，它的整个生命周期都能够轻松搞定，代价是牺牲了灵活性。在对 DSL(Domain Specific Languages)的热情持续高涨之时，通常的想法是设计一套能够解决特定领域问题的语言。在构建这方面，DSL 的一个成功案例就是 Gradle。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0

http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.technologyconversations</groupId>
    <artifactId>java-build-tools</artifactId>
    <packaging>jar</packaging>
    <version>1.0</version>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.3.2</version>
            </plugin>
        </plugins>
    </build>

</project>
```

通过执行下面的命令来运行 Maven goal 生成 Jar 文件。

```xml
mvn package
```

主要的区别在于 Maven 不需要指定执行的操作。我们没有创建 task，而是设置了一些参数(有哪些依赖，用哪些插件...). Maven 推行使用约定并提供了开箱即用的 goals。Ant 和 Maven 的 XML 文件都会随时间而变大，为了说明这一点，我们加入 CheckStyle，FindBugs 和 PMD 插件来进行静态检查，三者是 Java 项目中使用很普遍的的工具。我们希望将所有静态检查的执行以及单元测试一起作为一个单独的 targetVerify。当然我们还应该指定自定义的 checkstyle 配置文件的路径并且确保错误时能够提示。更新后的 Maven 代码如下：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>2.12.1</version>
    <executions>
        <execution>
            <configuration>
                <configLocation>config/checkstyle/checkstyle.xml</configLocation>
                <consoleOutput>true</consoleOutput>
                <failsOnError>true</failsOnError>
            </configuration>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>findbugs-maven-plugin</artifactId>
    <version>2.5.4</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-pmd-plugin</artifactId>
    <version>3.1</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

通过执行下面的命令来运行 Maven goal，包括单元测试，静态检查，如 CheckStyle，FindBugs 和 PMD。

```xml
mvn verify
```

# Gradle

Gradle 结合了前两者的优点，在此基础之上做了很多改进。它具有 Ant 的强大和灵活，又有 Maven 的生命周期管理且易于使用。最终结果就是一个工具在 2012 年华丽诞生并且很快地获得了广泛关注。例如，Google 采用 Gradle 作为 Android OS 的默认构建工具。Gradle 不用 XML，它使用基于 Groovy 的专门的 DSL，从而使 Gradle 构建脚本变得比用 Ant 和 Maven 写的要简洁清晰。Gradle 样板文件的代码很少，这是因为它的 DSL 被设计用于解决特定的问题：贯穿软件的生命周期，从编译，到静态检查，到测试，直到打包和部署。

它使用 Apache Ivy 来处理 Jar 包的依赖。Gradle 的成就可以概括为：约定好，灵活性也高。

```groovy
apply plugin: 'java'
apply plugin: 'checkstyle'
apply plugin: 'findbugs'
apply plugin: 'pmd'

version = '1.0'

repositories {
    mavenCentral()
}

dependencies {
    testCompile group: 'junit', name: 'junit', version: '4.11'
    testCompile group: 'org.hamcrest', name: 'hamcrest-all', version: '1.3'
}
```

    