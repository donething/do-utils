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
 * WXQiYe
 * @param date 日期
 * @param fmt 返回的可读日期。默认"YYYY-mm-dd HH:MM:SS"，对应日期 "2022-03-30 22:50:39"
 * @see https://www.jianshu.com/p/49fb78bca621
 */
export const date = (date = new Date(), fmt = "YYYY-mm-dd HH:MM:SS"): string => {
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
export const parseSec = (seconds: number, needTrim = false): string => {
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
export const gbk2UTF8 = (arrayBuffer: ArrayBuffer): string => {
  let decoder = new TextDecoder('gbk')
  return decoder.decode(arrayBuffer)
}

/**
 * 将文件大小转可读字符串，如 "123 KB"
 * @param size 文件的字节数
 */
export const fileSize2Str = (size: number): string => {
  if (size <= 0) return "NAN"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  let num = parseInt((size / Math.pow(1024, i)).toFixed(2))
  return num + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
}

/**
 * 截断长字符串，中间默认省略号
 *
 * 原理为：截断后的总长减去省略号的长度，再除以2即为原字符串可以展示的长度
 * @param fullStr 长字符串
 * @param strLen 截断后的总长度。若小于 fullStr 的长度，将只显示省略号
 * @param separator 省略号，默认"..."
 * @see https://github.com/definite2/use-dynamic-truncate-middle/blob/main/src/utils/truncateFromMiddle.ts
 */
export const trunStr = (fullStr: string, strLen: number, separator = "...") => {
  if (fullStr.length <= strLen) return fullStr

  let sepLen = separator.length
  let charsToShow = strLen - sepLen
  let frontChars = Math.ceil(charsToShow / 2)
  let backChars = Math.floor(charsToShow / 2)

  return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
}

/**
 * 截断长字符串，从最前面开始
 *
 * 如 trunStrBegin("abcdef", 3)，返回 "abc..."
 * @param fullStr 长字符串
 * @param len 需要保留的字符长度（不包括 separator）
 * @param separator 省略号，默认"..."
 */
export const trunStrBegin = (fullStr: string, len: number, separator = "...") => {
  let s = fullStr.substring(0, len)
  if (fullStr.length > len) {
    return s + separator
  }

  return s
}

/**
 * 计算字符串型式的数学计算
 * @param expression 字符串表达式，如 "1+3-2*3"。当格式错误时，会返回错误
 * @see https://stackoverflow.com/a/73250658
 */
export const calStr = (expression: string) => {
  return new Function(`return ${expression}`)()
}