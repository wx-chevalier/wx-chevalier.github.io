
---
title: 基于 fetch 的下载
linktitle: 基于 fetch 的下载
type: book
commentable: true
---

# 基于 fetch 的下载

可以直接在 fetch 中抓取文件，然后创建伪 a 元素，进行下载操作：

```js
fetch("http://somehost/check-permission", options).then((res) => {
  if (res.code === 0) {
    const a = document.createElement("a");
    const url = res.data.url;
    const filename = "myfile.zip";
    a.href = url;
    a.download = filename;
    a.click();
  } else {
    alert("You have no permission to download the file!");
  }
});
```

我们也可以对文件的内容进行自定义处理：

```js
fetch("/big-data.csv")
  .then(function (response) {
    const reader = response.body.getReader();
    const partialCell = "";
    const returnNextCell = false;
    const returnCellAfter = "Jake";
    const decoder = new TextDecoder();

    return search(reader);
  })
  .then(function (result) {
    console.log("Got the result! It's '" + result + "'");
  })
  .catch(function (err) {
    console.log(err.message);
  });

function search(reader) {
  return reader.read().then(function (result) {
    partialCell += decoder.decode(result.value || new Uint8Array(), {
      stream: !result.done,
    });

    // Split what we have into CSV 'cells'
    const cellBoundry = /(?:,|\r\n)/;
    const completeCells = partialCell.split(cellBoundry);

    if (!result.done) {
      // Last cell is likely incomplete
      // Keep hold of it for next time
      partialCell = completeCells[completeCells.length - 1];
      // Remove it from our complete cells
      completeCells = completeCells.slice(0, -1);
    }

    for (const cell of completeCells) {
      cell = cell.trim();

      if (returnNextCell) {
        reader.cancel("No more reading needed.");
        return cell;
      }
      if (cell === returnCellAfter) {
        returnNextCell = true;
      }
    }

    if (result.done) {
      throw Error("Could not find value after " + returnCellAfter);
    }

    return search();
  });
}
```

    