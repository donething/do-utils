/**
 * 新浪微博 mid 与 id 互转
 * 参考：https://www.cnblogs.com/dragondean/p/js-weibo-mid-url.html
 * 参考：作者: XiNGRZ (http://weibo.com/xingrz)
 * 实际作者：GPT 4
 */

// 62 进制字典
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BASE = 62

/**
 * 数字 ID 转为 mid
 * @param id 微博ID。如 "4885639100630954"
 * @return mid 如 "MzVRA2E8G"
 */
const id2Mid = (id: string): string => {
  let mid = ''
  for (let i = id.length - 7; i > -7; i -= 7) { // 每7位数字转换一次
    let offset = i < 0 ? 0 : i
    let len = i < 0 ? id.length % 7 : 7
    let num = parseInt(id.substring(offset, offset + len))
    let segment = encode62(num).padStart(4, '0') // 先补齐4位
    mid = segment + mid // 拼接字符串
  }
  mid = mid.replace(/^0+/, '') // 删除前导零
  return mid
}

/**
 * mid 转为 数字 ID
 * @param mid 如 "MzVRA2E8G"
 * @return id 微博ID。如 "4885639100630954"
 */
const mid2id = (mid: string): string => {
  let id = ''
  // 每4位字符转换一次
  for (let i = mid.length; i > 0; i -= 4) {
    let offset = i < 4 ? 0 : i - 4
    let len = i < 4 ? i : 4
    let str = mid.substring(offset, offset + len)
    let num = decode62(str).toString()
    // 不是最高位数字组，不足7位补0
    if (offset > 0) {
      num = num.padStart(7, '0')
    }
    id = num + id
  }
  return id
}

// 10进制转为62进制
const encode62 = (num: number): string => {
  let result = ''
  do {
    result = ALPHABET[num % BASE] + result
    num = Math.floor(num / BASE)
  } while (num > 0)
  return result
}

// 62进制转为10进制
const decode62 = (str: string): number => {
  let result = 0
  for (let i = 0; i < str.length; i++) {
    result = result * BASE + ALPHABET.indexOf(str[i])
  }
  return result
}

const WeiboUtility = {mid2id, id2Mid}

export default WeiboUtility
