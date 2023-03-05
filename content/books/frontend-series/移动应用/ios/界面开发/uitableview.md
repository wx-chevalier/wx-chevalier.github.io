
---
title: UITableView
linktitle: UITableView
type: book
commentable: true
---

# UITableView

> 参考资料
>
> - [iOS 开发系列--UITableView 全面解析][1]

使用 UITableView 时，一般会要实现两个 Protocol：

UITableViewDataSource 与 UITableViewDelegate。注意，如果使用 UITableViewController 方法，它使自动继承了上述两个 Protocol，但是他会内置一个 tableview。如果是自己在 Xib 文件中设置了 UITableView，建议还是使用原生的 UIViewController。

其中 UITableViewDataSource 的需要实现的方法为：

| 方 法                                           | 返回类型          | 说 明                                          |
| ----------------------------------------------- | ----------------- | ---------------------------------------------- |
| tableView:cellForRowAtIndexPath:                | UITableViewCell\* | 为表视图单元格提供数据，该方法是必须实现的方法 |
| tableView:numberOfRowsInSection:                | NSInteger         | 返回某个节中的行数                             |
| tableView:titleForHeaderInSection:              | NSString          | 返回节头的标题                                 |
| tableView:titleForFooterInSection:              | NSString          | 返回节脚的标题                                 |
| numberOfSectionsInTableView:                    | NSInteger         | 返回节的个数                                   |
| sectionIndexTitlesForTableView:                 | NSArray\*         | 提供表视图节索引标题                           |
| tableView:commitEditingStyle:forRowAtIndexPath: | void              | 为删除或修改提供数据                           |

UITableViewDelegate 需要实现的方法为：

| 方 法                                             | 返回类型 | 说 明                                                                |
| ------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| tableView:viewForHeaderInSection:                 | UIView\* | 为节头准备自定义视图，iOS 6 之后可以使用 UITableViewHeaderFooterView |
| tableView:viewForFooterInSection:                 | UIView\* | 为节脚准备自定义视图，iOS 6 之后可以使用 UITableViewHeaderFooterView |
| tableView:didEndDisplayingHeaderView:forSection:  | void     | 该方法在节头从屏幕中消失时触发(iOS 6 之后的方法)                     |
| tableView:didEndDisplayingFooterView:forSection:  | void     | 当节脚从屏幕中消失时触发(iOS 6 之后的方法)                           |
| tableView:didEndDisplayingCell:forRowAtIndexPath: | void     | 当单元格从屏幕中消失时触发(iOS 6 之后的方法)                         |
| tableView:didSelectRowAtIndexPath:                | void     | 响应选择表视图单元格时调用的方法                                     |

## Simple UITableView

UITableView 有两种风格：UITableViewStylePlain 和 UITableViewStyleGrouped。这两者操作起来其实并没有本质区别，只是后者按分组样式显示前者按照普通样式显示而已。大家先看一下两者的应用：

![Group][2]

![Plain][3]

这两种不同的呈现模式，可以利用初始化时候指定：

```
self.tableView =[[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
```

如果是利用 Xib 来构建一个 UITableView,也可以在

最简单的完成 UITableView 的时序图如下：

![][4]

### DataSource:数据源

在完成对于 UITableView 的初始化之后，需要指定 UITableView 的数据源。即指定\_tableView 的句柄指向一个实现了 UITableViewDataSource 的类。

```
    //设置数据源，注意必须实现对应的UITableViewDataSource协议
    _tableView.dataSource=self;
```

#### tableView:cellForRowAtIndexPath:

数据源的接口中，最重要的就是要完成对于 Cell 的构造。在简单实现中，我们可以调用系统提供的默认样式：

```
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath*)indexPath
{
    //初始化Cell
    static NSString *CellIdentifier = @"CellIdentifier";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil)
    {
      cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault
      reuseIdentifier:CellIdentifier];
    }
    //为Cell填充数据
    NSUInteger row = [indexPath row];
    NSDictionary *rowDict = [self.listTeams objectAtIndex:row];
    cell.textLabel.text = [rowDict objectForKey:@"name"];
    NSString *imagePath = [rowDict objectForKey:@"image"];
    imagePath = [imagePath stringByAppendingString:@".png"];
    cell.imageView.image = [UIImage imageNamed:imagePath];
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    return cell;
}
```

除了 Default 的样式之外，其他 iOS 还默认提供的 Cell 的样式有：

- UITableViewCellStyleSubtitle

  Subtitle 样式：左边一个显示图片的 imageView，上边一个主标题 textLabel，一个副标题 detailTextLabel。主标题字体大且加黑，副标题字体小在主标题下边。

- UITableViewCellStyleValue1

  Value1 样式：左边一个显示图片的 imageView，左边一个主标题 textLabel，右边一个副标题 detailTextLabel，主标题字体比较黑。

- UITableViewCellStyleValue2

  Value2 样式：左边一个主标题 textLabel 字体偏小，挨着右边一个副标题 detailTextLabel，字体大且加黑。

## UITableViewCell:自定义样式

### UITableViewCellAccessory

```
typedef NS_ENUM(NSInteger, UITableViewCellAccessoryType) {
    UITableViewCellAccessoryNone,                   // 不显示任何图标
    UITableViewCellAccessoryDisclosureIndicator,    // 跳转指示图标
    UITableViewCellAccessoryDetailDisclosureButton, // 内容详情图标和跳转指示图标
    UITableViewCellAccessoryCheckmark,              // 勾选图标
    UITableViewCellAccessoryDetailButton NS_ENUM_AVAILABLE_IOS(7_0) // 内容详情图标
};
```

![Cell 操作][5]

可以通过：

```
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
```

方式来进行指定。

### CustomCell

如果需要使用自定义的 Cell，可以先建立一个自定义的 Xib 文件，并将其与某个 View 建立关联。如下图所示：

![生成自定义Xib文件][6]

然后，同样的在关于生成 Cell 的 Delegate 方法中，进行 Cell 的配置：

```
- (UITableViewCell *)tableView:(UITableView *)tableView
cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
  static NSString *CellIdentifier = @"Cell";
  CustomCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
  NSUInteger row = [indexPath row];
  NSDictionary *rowDict = [self.listTeams objectAtIndex:row];
  cell.name.text = [rowDict objectForKey:@"name"];
  NSString *imagePath = [rowDict objectForKey:@"image"];
  imagePath = [imagePath stringByAppendingString:@".png"];
  cell.image.image = [UIImage imageNamed:imagePath];
  cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
  return cell;
}
```

注意，在上述代码中，不需要再手动对于 Cell 进行初始化了。

> 常见错误
>
> reason: 'unable to dequeue a cell with identifier Cell - must register a nib or a class for the identifier or connect a prototype cell in a storyboard’

```objective-c
//注册一个Class作为ReusableCell
[self.tableView registerClass:[HSFriendListView class] forCellReuseIdentifier:@"HSFriendListViewCell"];

//注册一个Nib文件作为ReusableCell
 [self.tableView registerNib:[UINib
    nibWithNibName:@"HSCommentCell"
    bundle:[NSBundle mainBundle]]
    forCellReuseIdentifier:reuseIdentifier];
```

### Auto Height

- [FDTemplateLayoutCell][7]

  [enter description here][8]

# Static UITableView

[ios-static-table-view-storyboard](http://www.appcoda.com/ios-static-table-view-storyboard/)

# UITableView-Extension

## QuickCreate

这部分总结了一些快速创建表单的辅助。

### [Eureka](https://github.com/xmartlabs/Eureka#introduction)

![](https://github.com/xmartlabs/Eureka/raw/master/Example/Media/EurekaNavigation.gif)

![](https://github.com/xmartlabs/Eureka/raw/master/Example/Media/EurekaRows.gif)

## Folding

### [folding-cell](https://github.com/Ramotion/folding-cell)

![](https://github.com/Ramotion/folding-cell/raw/master/Screenshots/folding-cell.gif)

# AutoHeight

## [TableViewCellWithAutoLayoutiOS8](https://github.com/smileyborg/TableViewCellWithAutoLayoutiOS8)

    