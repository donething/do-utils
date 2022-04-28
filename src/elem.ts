import {sleep} from "./utils"

/**
 * 获取当前网页中正在播放的占用最大面积的视频元素
 * @param doc 文档
 * @see google
 */
export const findLargestPlayingVideo = function (doc: Document): HTMLVideoElement | null {
  /** @namespace video.disablePictureInPicture **/
  const videos = Array.from(doc.querySelectorAll('video'))
    .filter(video => video.readyState !== 0)
    // .filter(video => video.disablePictureInPicture === false)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0] || {width: 0, height: 0}
      const v2Rect = v2.getClientRects()[0] || {width: 0, height: 0}
      return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height))
    })

  if (videos.length === 0) {
    return null
  }
  return videos[0]
}

/**
 * 发送 chromium 桌面通知
 *
 * 仅在 background 脚本中可用，在 content script 中可使用标准 Web 通知
 *
 * options 必须包含 title、message、iconUrl 属性
 * 使用：notify(options, actions)
 * @see https://stackoverflow.com/a/52109693
 * @see https://developer.chrome.com/extensions/notifications#NotificationOptions
 */
export const notify = function (options: chrome.notifications.NotificationOptions,
                                actions?: Array<Function | undefined>) {
  let myNotificationID = ""

  // 除了 title、message 外，其它必要的属性
  options.type = options.type || "basic"

  // 发送通知
  chrome.notifications.create(options, notificationId => {
    myNotificationID = notificationId
  })

  // 为通知的按钮添加点击事件
  chrome.notifications.onButtonClicked.addListener((noID, btnIdx) => {
    if (noID === myNotificationID) {
      if (btnIdx === 0 && actions && actions[0]) {
        actions[0]()
      } else if (btnIdx === 1 && actions && actions[1]) {
        actions[1]()
      }
    }
  })
}

/**
 * 等待直到指定的元素存在（需在async函数中await调用）
 * @param selector CSS元素选择器
 * @param interval 等待判断的间隔时间（单位毫秒，不指定时为300毫秒）
 */
export const waitForElem = async function (selector: string, interval = 300) {
  while (!document.querySelector(selector)) {
    await sleep(interval)
  }
}

/**
 * 保存数据到本地
 * @param data 任意类型的数据
 * @param filename 指定文件名
 * @see https://juejin.cn/post/6844903699496566792
 */
export const download = function (data: any, filename: string) {
  switch (typeof data) {
    // 如果是对象，先转为JSON字符串，再保存
    case "object":
      data = JSON.stringify(data)
      // [data]表示将 data 转为数组
      data = [data]
      break
    case "string":
      // [data]表示将 data 转为数组
      data = [data]
      break
  }

  let blob = new Blob(data)
  let a = document.createElement('a')
  let url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = filename || `chromium-task_${Date.now()}`
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * 滚动到目标元素
 * @param selector 元素选择器，如 "div.p"
 */
export const scrollIntoView = function (selector: string) {
  let elem = document.querySelector(selector)
  if (!elem) {
    console.log("元素不存在，无法滚动到此")
    return
  }
  elem.scrollIntoView({block: "center", behavior: "smooth"})
}

/**
 * 插入内联 JavaScript
 * 返回 脚本所在的HTML元素
 * @param code JavaScript 代码
 */
export const insertJS = function (code: string | Function): HTMLScriptElement {
  let script = document.createElement("script")
  // 使用匿名函数是为了避免干扰原执行环境，如报变量已存在的错误
  script.textContent = '(' + code + ')()';
  // 添加到网页中
  (document.head || document.documentElement).appendChild(script)

  return script
}

/**
 * 插入内联 JavaScript
 * 返回 脚本所在的HTML元素
 * @param src 注入脚步的路径
 */
export const insertJSSrc = function (src: string): HTMLScriptElement {
  let script = document.createElement("script")
  // 注入脚本，不能使用textContent属性，会报错 inline code
  script.src = src;
  // 添加到网页中
  (document.head || document.documentElement).appendChild(script)

  return script
}

/**
 * 将 HTML 字符串转换为 HTMLElement 对象
 *
 * 1. 如果只有一个顶层元素，那么返回该元素
 *
 * 2. 如果该有多个顶层元素，则用 div 包裹后返回
 *
 * 此方法会自动下载其中的图片等资源，如果仅需解析为 DOM，可以用 domParser
 *
 * @param str 需解析的字符串
 * @see https://stackoverflow.com/a/494348/8179418
 */
export const elemOf = function (str: string): Element {
  let div = document.createElement('div')
  div.innerHTML = str

  // Change this to div.childNodes to support multiple top-level nodes
  if (div.children.length === 1) {
    return div.firstElementChild as Element
  }
  return div
}

// 消息的类型
export const Msg = {info: "info", success: "success", warning: "warning", error: "error"}
/**
 * 在网页内显示消息提示（仅在内容脚本中可用）
 * @param message 消息都内容
 * @param type 消息都类型，可选 MSG 中的值。默认为"info"
 * @param duration 消息都持续时间（毫秒）。默认 3 秒
 */
export const showMsg = async function (message: string, type = Msg.info, duration = 3000) {
  // 获取消息的的弹窗，以及消息项。消息弹窗内可以放置多条消息项
  let htmlURL = chrome.runtime.getURL("/htmls/message.html")
  let resp = await fetch(htmlURL)
  let html = elemOf(await resp.text())

  // 消息盒子，内含消息。已存在则重用，不存在则用新的
  let msgBox = document.querySelector("#do-msgbox") || html.querySelector("#do-msgbox")
  // 消息项
  let msg = html.querySelector(".do-msg")

  // 根据消息类型，显示内容
  // 显示消息的图标
  // @ts-ignore
  msg.querySelector(`.do-msg-${type}`).style.display = "inline"
  // 显示消息的文本
  // @ts-ignore
  msg.querySelector(".do-msg-text").innerText = message
  // 弹出消息
  // @ts-ignore
  document.body.appendChild(msgBox)

  // 添加到消息盒子中（添加动画）
  // @ts-ignore
  msgBox.appendChild(msg)

  // 到时即移除消息项
  setTimeout(() => {
    // 移除消息项
    // @ts-ignore
    msg.style.display = "none"
  }, duration)
}

/**
 * 复制文本到剪贴板（仅在内容脚本中可用）
 *
 * 该方法创建的 textarea 不能设置为 "display: none"，会导致复制失败
 * @param doc 需要传递DOM对象
 * @param text 需要复制的文本
 */
export const copyText = function (doc: Document, text: string) {
  let textarea = doc.createElement("textarea")
  doc.body.appendChild(textarea)
  textarea.value = text
  textarea.select()
  doc.execCommand("copy")
  textarea.remove()
}