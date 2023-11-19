/**
 * 执行网络请求
 *
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