/**
 * 使用 sha256 加密文本
 * @param text 待加密的文本
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
export const sha256 = async (text: string): Promise<string> => {
  // encode as (utf-8) Uint8Array
  const msgUint8 = new TextEncoder().encode(text)
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  // convert bytes to hex string, and return
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 格式化日期
 * @param date 日期
 * @param fmt 返回的可读日期。默认"YYYY-mm-dd HH:MM:SS"，对应日期 "2022-03-30 22:50:39"
 * @see https://www.jianshu.com/p/49fb78bca621
 */
export const date = function (date = new Date(), fmt = "YYYY-mm-dd HH:MM:SS"): string {
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }

  let ret: RegExpExecArray | null
  for (const [key, value] of Object.entries(opt)) {
    ret = new RegExp("(" + key + ")").exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? value : value.padStart(ret[1].length, "0")
      )
    }
  }

  return fmt
}

/**
 * 将秒数转为 时分秒，格式如 "01:02:03"、"02:03"
 * @param seconds 秒
 * @param needTrim 当小时位为 0 时，是否删除开头的"00:"。默认不删除
 */
export const parseSec = function (seconds: number, needTrim = false): string {
  let str = new Date(seconds * 1000).toISOString().substr(11, 8)
  if (str.indexOf("00:") === 0 && needTrim) {
    return str.replace("00:", "")
  }
  return str
}

/**
 * 转换 GBK 编码为 UTF-8 编码的字符串
 * @param arrayBuffer 如果希望传递的参数是 Blob，可先通过`await blob.arrayBuffer()`转换为 ArrayBuffer 后传递
 * @see https://stackoverflow.com/a/38490522
 */
export const gbk2UTF8 = function (arrayBuffer: ArrayBuffer): string {
  let decoder = new TextDecoder('gbk')
  return decoder.decode(arrayBuffer)
}

/**
 * 将文件大小转可读字符串，如 "123 KB"
 * @param size 文件的字节数
 */
export const fileSize2Str = function (size: number): string {
  if (size <= 0) return "NAN"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  let num = parseInt((size / Math.pow(1024, i)).toFixed(2))
  return num + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
}