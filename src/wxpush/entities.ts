// 获取 token 的响应
type TokenResult = {
  access_token: string,
  expires_in: number,
  errcode: number,
  errmsg: string,
}

// 发送消息的响应
type PushResult = {
  errcode: number,
  errmsg: string,
  msgid: number,
}