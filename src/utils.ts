// 常用工具函数
// 不能在 chrome.scripting.executeScript() 的参数 func 内中调用本工具，会报错：
// VM1589:2 Uncaught ReferenceError: utils is not defined

/**
 * 等待指定的毫秒时间
 *
 * 用法为: await sleep(1000) 或 sleep(1000).then(...)
 * @param time 毫秒数
 */
export const sleep = async (time: number) => {
  await new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 执行网络请求
 * 因为使用了 fetch，仅支持在类 chromium 中调用
 * @param url 目标链接
 * @param data 需要 POST 的数据
 * @param init 其它选项
 */
export const request = async (url: string, data?: FormData | object | string, init?: RequestInit) => {
  let ops: RequestInit = init || {}

  // 是否为POST请求
  if (data) {
    ops.method = "POST"
    ops.headers = new Headers(init?.headers)

    // 判断POST的数据类型
    if (data instanceof FormData) {
      // POST 二进制数据，不需要指定类型
      ops.body = data
    } else if (typeof data === "object") {
      // POST json 数据
      ops.body = JSON.stringify(data)
      // 如果参数 headers 中有指定 Content-Type，则使用已指定的值，否则设为 json
      if (!ops.headers.get("Content-Type")) {
        ops.headers.append("Content-Type", "application/json")
      }
    } else {
      // typeof data === "string"
      // POST 表单
      ops.body = data
      if (!ops.headers.get("Content-Type")) {
        // 如果参数 headers 中有指定 Content-Type，则使用已指定的值，否则设为 form
        ops.headers.append("Content-Type", "application/x-www-form-urlencoded")
      }
    }
  }

  return await fetch(url, ops)
}

/**
 * 复制文本到剪贴板（仅在后台脚本中可用）
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