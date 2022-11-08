import {sleep} from "./utils"

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
export const notify = (options: chrome.notifications.NotificationOptions, actions?: Array<Function | undefined>) => {
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
export const waitForElem = async (selector: string, interval = 300) => {
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
export const download = (data: any, filename: string) => {
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
  a.download = filename
  a.click()
  setTimeout(() => window.URL.revokeObjectURL(url), 10)
}

/**
 * 滚动到目标元素
 * @param selector 元素选择器，如 "div.p"
 */
export const scrollIntoView = (selector: string) => {
  let elem = document.querySelector(selector)
  if (!elem) {
    console.log(`元素"${selector}"不存在，无法滚动到此`)
    return
  }

  elem.scrollIntoView({block: "center", behavior: "smooth"})
}

/**
 * 插入内联 JavaScript
 * 返回 脚本所在的HTML元素
 * @param code JavaScript 代码
 */
export const insertJS = (code: string | Function): HTMLScriptElement => {
  let script = document.createElement("script")
  // 使用匿名函数是为了避免干扰原执行环境，如报变量已存在的错误
  script.textContent = '(' + code + ')()';
  // 添加到网页中
  (document.head || document.documentElement).appendChild(script)

  return script
}

/**
 * 插入外联 JavaScript
 * 返回 脚本所在的HTML元素
 * @param src 注入脚步的路径
 */
export const insertJSSrc = (src: string): HTMLScriptElement => {
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
export const elemOf = (str: string): Element => {
  let div = document.createElement('div')
  div.innerHTML = str

  // Change this to div.childNodes to support multiple top-level nodes
  if (div.children.length === 1) {
    return div.firstElementChild as Element
  }
  return div
}

/**
 * `showMsg` 发送消息的类型
 */
export const Msg = {info: "info", success: "success", warning: "warning", error: "error"}
/**
 * 在网页内显示消息提示（仅在内容脚本中可用）
 * @param message 消息都内容
 * @param type 消息都类型，可选 MSG 中的值。默认为"info"
 * @param duration 消息都持续时间（毫秒）。默认 3 秒
 */
export const showMsg = async (message: string, type = Msg.info, duration = 3000) => {
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
 * 复制内容
 * @param data 文本或数据
 */
export const copy = async (data: string | ClipboardItems) => {
  return typeof data === "string" ?
    await navigator.clipboard.writeText(data) :
    await navigator.clipboard.write(data)

}

/**
 * 复制文本到剪贴板（仅在扩展的内容脚本中可用）
 *
 * 该方法创建的 textarea 不能设置为 "display: none"，会导致复制失败
 * @param doc 需要传递DOM对象
 * @param text 需要复制的文本
 */
export const copyText = (doc: Document, text: string) => {
  let textarea = doc.createElement("textarea")
  doc.body.appendChild(textarea)
  textarea.value = text
  textarea.select()
  doc.execCommand("copy")
  textarea.remove()
}

/**
 * 复制文本到剪贴板（仅在扩展的后台脚本中可用）
 *
 * 该方法创建的 textarea 不能设置为 "display: none"，会导致复制失败
 * @param text 需要复制的文本
 */
export const copyTextInBG = (text: string) => {
  chrome.tabs.query({active: true}, tabs => {
    if (tabs.length === 0 || !tabs[0].id) {
      console.error("后台复制文本出错，tabs 信息不完整：", JSON.stringify(tabs))
      throw "后台复制文本出错，tabs 信息不完整"
    }

    // 向当前标签中注入文本框，以复制指定文本
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: (text: string) => {
        let textarea = document.createElement("textarea")
        document.body.appendChild(textarea)
        textarea.value = text
        textarea.select()
        document.execCommand("copy")
        textarea.remove()
      },
      args: [text]
    })
  })
}

/**
 * 返回 多重比较器
 * @param  sortRule 比较器的数组，按顺序比较，如 [onlineSort, platSort, nameSort]
 */
export const multiComparator = (sortRule: Array<Function>): Function => {
  return function <T>(a: T, b: T): number {
    let tmp, i = 0
    do {
      tmp = sortRule[i](a, b)
      i++
    } while (tmp === 0 && i < sortRule.length)
    return tmp
  }
}

/**
 * 向有序数组中添加元素（新数组依然有序）
 *
 * 也可以直接用于数组排序：myarray.sort(multiComparator(sortRule))
 * @param array 目标数组
 * @param element 待添加的元素
 * @param sortRule 比较器的数组，按传参顺序比较：[onlineSort, platSort, nameSort]
 */
export const insertOrdered = <T>(array: Array<T>, element: T, sortRule: Array<Function>): Array<T> => {
  let i: number
  // react 更新数组，需要生成新数组，界面上才能改变
  let newArray = [...array]

  // 排序规则为空，直接将元素添加到数组末尾
  if (!sortRule || sortRule.length === 0) {
    newArray.push(element)
    return newArray
  }

  // 当排序函数返回值等于 1，表示 element 值比较“大” 要继续往后查找位置
  // 当返回值等于 1- 或 0 时，表示 element 值小于等于 array[1]，应该排在 array[i] 的同一位置或前面
  // 此时退出 for，达到按序插入元素的目的
  for (i = 0; i < newArray.length && multiComparator(sortRule)(element, newArray[i]) >= 1; i++) {
  }
  newArray.splice(i, 0, element)
  return newArray
}

/**
 * 获取当前网页中正在播放的占用最大面积的视频元素
 * @param doc 文档
 * @see google
 */
export const findLargestPlayingVideo = (doc: Document): HTMLVideoElement | null => {
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