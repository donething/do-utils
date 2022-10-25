/**
 * 请求 token 的响应
 */
type TokenResult = {
  /**
   * 访问 token，获取后才能发送消息
   */
  access_token: string,
  /**
   * 过期时间
   */
  expires_in: number,
  /**
   * 获取成功时，没有该项，出错时才有
   */
  errcode: number,
  /**
   * 错误的提示
   */
  errmsg: string,
}

/**
 * 请求发送消息的响应
 */
type PushResult = {
  /**
   * 为 0 表示没错误
   */
  errcode: number,
  /**
   * 错误的提示
   */
  errmsg: string,
  /**
   * 返回的消息 ID
   */
  msgid: number,
}