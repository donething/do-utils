# do-utils

# 打包发布

## 构建

执行 `yarn build`。会实际执行 `rollup -c`，完成打包

## 发布到 `rpm`

执行 `rpm publish`。按提示登录后再次执行完成发布

# elem

## findLargestPlayingVideo

获取当前网页中正在播放的占用最大面积的视频元素

## notify

发送 chromium 桌面通知。仅在 background 脚本中可用，在 content script 中可使用标准 Web 通知

## waitForElem

等待直到指定的元素存在（需在async函数中await调用）

## download

保存数据到本地

## scrollIntoView

滚动到目标元素

## insertJS

插入内联 JavaScript

## insertJSSrc

插入外联 JavaScript

## elemOf

将 HTML 字符串转换为 HTMLElement 对象。此方法会自动下载其中的图片等资源，如果仅需解析为 DOM，可以用 domParser

## showMsg

在网页内显示消息提示。仅在内容脚本中可用

## copyText

复制文本到剪贴板。仅在内容脚本中可用

## insertOrdered

向有序数组中添加元素（新数组依然有序）

## multiComparator

返回 多重比较器

# text

## sha256

使用 sha256 加密文本

## date

格式化日期

## parseSec

将秒数转为 时分秒，格式如 "01:02:03"、"02:03"

## gbk2UTF8

转换 GBK 编码为 UTF-8 编码的字符串

## fileSize2Str

将文件大小转可读字符串，如 "123 KB"

## random

返回两数之间（包含）的随机数

# tg

```typescript
let tg = new TGSender("xxx")
tg.sendMessage("chat_id", "yyy")
```

# utils

## sleep

等待指定的毫秒时间

## request

执行网络请求

## copyTextInBG

复制文本到剪贴板。仅在后台脚本中可用

# wxpush 企业微信、微信测试号 推送消息

## 企业微信

```typescript
// 初始化
let wxPush = new WXQiYe(data.settings.wxToken.appid, data.settings.wxToken.secret)
let agentid = data.settings.wxToken.toUID

// 推送文本消息
// content 可以使用`\n`换行
let err = await wxPush.pushText(agentid, content)
// 推送卡片消息
let err = await wxPush.pushCard(agentid, title, description, "", url, btnTxt)
// 推送 Markdown 消息（暂只支持企业微信接收）
let err = await wxPush.pushMarkdown(agentid, content)

// 处理错误
if (err) {
  console.log("推送微信消息失败", error)
  notify({
    title: "推送微信消息失败",
    message: error.message,
    iconUrl: chrome.runtime.getURL("/icons/extension_48.png")
  })
  return
}

console.log("推送微信消息成功：", title)
```

## 微信测试号

```typescript
let sb = new WXSandbox("xxx", "xxx");
let error = await sb.pushTpl("xxx", "xxx", "测试标题", "测试内容");
if (error != null) {
  console.log("发送消息出错：", error);
}
```

# 注意

不能在 `chrome.scripting.executeScript()` 的参数 func 内调用本工具，会报错：VM1589:2 Uncaught ReferenceError: xx is not defined

# 参考

* [使用Typescript编写和发布npm包 - 简书](https://www.jianshu.com/p/8fa2c50720e4)