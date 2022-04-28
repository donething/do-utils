// 常用工具函数
// 不能在 chrome.scripting.executeScript() 的参数 func 内中调用本工具，会报错：
// VM1589:2 Uncaught ReferenceError: utils is not defined

/**
 * 等待指定的毫秒时间
 *
 * 用法为: await sleep(1000) 或 sleep(1000).then(...)
 * @param time 毫秒数
 */
export const sleep = async function (time: number) {
  await new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 向有序数组中添加元素（新数组依然有序）
 *
 * 也可以直接用于数组排序：myarray.sort(multiComparator(sortRule))
 * @param array 目标数组
 * @param element 待添加的元素
 * @param sortRule 比较器的数组，按传参顺序比较：[onlineSort, platSort, nameSort]
 */
export const insertOrdered = function <T>(array: Array<T>, element: T, sortRule: Array<Function>): Array<T> {
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
 * 返回的是多重比较器
 * @param  sortRule 比较器的数组，按顺序比较，如 [onlineSort, platSort, nameSort]
 * @returns 返回多重比较器的最终比较函数
 */
export const multiComparator = function (sortRule: Array<Function>): Function {
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
 * 返回两数之间（包含）的随机数
 * @param  min 最小值
 * @param  max 最大值
 * @see https://www.cnblogs.com/starof/p/4988516.html
 */
export const random = function (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 执行网络请求
 * 因为使用了 fetch，仅支持在类 chromium 中调用
 * @param url 目标链接
 * @param data 需要 POST 的数据
 * @param init 其它选项
 */
export const request = async function (url: string, data?: FormData | object | string, init?: RequestInit) {
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
export const copyTextInBG = function (text: string) {
  chrome.tabs.query({active: true}, tabs => {
    if (tabs.length === 0 || !tabs[0].id) {
      console.log("后台复制文本出错，tabs 信息不完整", tabs)
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