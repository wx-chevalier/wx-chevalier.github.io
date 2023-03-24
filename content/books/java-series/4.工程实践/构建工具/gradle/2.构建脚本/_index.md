
---
title: 2.构建脚本
linktitle: 2.构建脚本
type: book
commentable: true
---

# Gradle 构建

和 Maven 一样，Gradle 也是通过 artifact 来打包构建的。得益于上述的 Gradle 本身的特性，artifact 在 Gradle 里实现得更灵活一些。看一个例子：

```sh
$ cat userguide/artifacts/uploading/build.gradle

## jar类型的artifact
task myJar(type: Jar)
artifacts {
    archives myJar
}
## file类型的artifact
def someFile = file('build/somefile.txt')
artifacts {
    archives someFile
}

## 根据自定义task来完成artifact
task myTask(type:  MyTaskType) {
    destFile = file('build/somefile.txt')
}
artifacts {
    archives(myTask.destFile) {
        name 'my-artifact'
        type 'text'
        builtBy myTask
    }
}

## 根据自定义task来完成artifact
task generate(type:  MyTaskType) {
    destFile = file('build/somefile.txt')
}
artifacts {
    archives file: generate.destFile, name: 'my-artifact', type: 'text', builtBy: generate
}
```

这样就简单地定义了好几种 artifact 生成的定义，根据不同的场景需求，生成文本文件、jar 包或者 zip，还可以再上传到服务器上。一般情况下，常用的插件，比如说 `Java plugin` 都默认定义了 jar 这样的 artifact task，所以一般不需要额外开发。但是，针对于一些复杂情况，或者在 plugin 基础上增强的话，自定义 artifact task 还是非常有用的。

# 项目发布

## Maven 中心库

首先我们需要准备账户，并且创建项目。首先，在 [sonatype 官网](https://issues.sonatype.org/)中注册账号，然后在 [CreateIssue](https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134) 中新建一个“Project ticket”。点击 Create 之后，你就会进入一个 jira 页面(sonatype 使用 jira 来追踪每一个项目进度)，与此同时你注册时使用的邮箱中也会收到一封邮件提示你，任务创建成功,正在等待处理。

![CreateIssue](https://s2.ax1x.com/2019/12/21/QjDPI0.md.png)

创建完毕后就等待一段时间，刷新页面。当状态变为“resolved”，然后你就可以使用 Gradle 上传项目了。或者就等着接收 sonatype 的反馈邮件，确认已经为你创建好了新项目。

### 项目配置

```groovy
apply plugin: 'maven'
apply plugin: 'signing'

signing {
    sign configurations.archives
}

group = "io.github.meetsl"
archivesBaseName = "SCardView"
version = "1.0"

uploadArchives {
    repositories {
        mavenDeployer {
            beforeDeployment {
                MavenDeployment deployment -> signing.signPom(deployment)
            }

            repository(url: "https://oss.sonatype.org/service/local/staging/deploy/maven2/") {
                authentication(userName: ossrhUsername, password: ossrhPassword)
            }

            snapshotRepository(url: "https://oss.sonatype.org/content/repositories/snapshots/") {
                authentication(userName: ossrhUsername, password: ossrhPassword)
            }

            pom.project {
                name 'SCardView'
                packaging 'aar'
                description 'This is a view that is similar to the CardView of google，but it can change the position of shadow and the shadow color of it . '
                url 'https://github.com/meetsl/SCardView-master'

                scm {
                    connection 'scm:git:https://github.com/meetsl/SCardView-master.git'
                    developerConnection 'scm:git:https://github.com/meetsl/SCardView-master.git'
                    url 'https://github.com/meetsl/SCardView-master.git'
                }

                licenses {
                    license {
                        name 'The Apache License, Version 2.0'
                        url 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                    }
                }

                developers {
                    developer {
                        id 'xxxxxx'
                        name 'xxxxxx'
                        email 'xxxxxxxx.com'
                    }
                }
            }
        }
    }
}
```

在上面的代码中，大家请将根域中的 group, archiveBaseName, version 以及 uploadArchives#pom.project 中的相关描述信息替换成自己的就好了。这些信息将会在接下来上传的时候，自动打包成 Maven 项目，并封装相应信息。

### 密钥

首先我们需要创建一个 gpg 签名秘钥，并将公钥上传到指定服务器。对于在 MacOS 下，我们可以下载一个叫做 GPGTools（http://www.gpgtools.org）的工具生成我们的签名文件。在 Windows 下，我们下载安装一个 Kleopatra（https://www.gpg4win.org/thanks-for-download.html）工具生成我们的签名文件。这两个工具使用基本一致，在安装完成之后，新建一个密钥对，并将本地公钥上传到指定服务器。

上传完成之后，就可以正式配置签名信息以及你的 Maven 账户信息了，我们在 Library Module 的根目录下新建一个 gradle.properties 文件，内容如下:

```yml
signing.keyId= 密钥的ID（注意一下，密钥ID 是一个八个字节的字符串 Kleopatra工具需要悬浮在 密钥ID 一栏查看）
signing.password= 密钥的密码 (生成证书时填写的密码)
signing.secretKeyRingFile=..\\secret.gpg（secret.gpg为私密证书。将导出的私密证书，放置在工程目录下）
ossrhUsername= sonatype 账号
ossrhPassword= sonatype 密码
```

配置成功之后，按照下图运行 uploadArchives 就可以开始上传了，这样就可以将你的文件上传到 Maven 中央库了。

### 正式发布

通过上面的步骤，我们只是把开源库放置在了一个私有的 Maven 仓库中，是不能被其他人所访问的。所以还需要我们自己将它发布出去：

- 进入以下地址:https://oss.sonatype.org/，并使用 sonatype 的账号密码在右上角进行登录。

- 登录成功，在左侧的导航栏，你会看到一个叫做 Staging Repositories 的选项，点击它，你会发现出现了很多列表选项。

![Repository Manager](https://s2.ax1x.com/2019/12/21/QjDARU.md.png)

根据列表名称，你会发现一个以你的 groud id 去掉点号后加上一个四位数字命名的 Repository，选中它，你会发现上方的 Close 按钮亮起，当你确认上传无误之后，你可以点击 Close 按钮，关闭掉这个仓库，不允许再次上传。如果关闭成功，你点击刷新以后会发现，Release 按钮亮起，点击它即可发布。如果关闭失败，你可以看看下方的界面，查找一下失败原因，再次上传代码，关闭后发布。

## 私有仓库

Gradle 构建的项目，发布到仓库中，也非常容易：

```groovy
apply plugin: 'maven'

uploadArchives {
    repositories {
        ivy {
            credentials {
                username "username"
                password "pw"
            }
            url "http://repo.mycompany.com"
        }
    }
}
```

    