import {request} from "../utils/utils"

/**
 * 通过企业微信、微信测试号 的消息推送类
 */
export class WXPush {
  // 获取 token 的 URL，在子类的构造函数构造
  protected tokenURL: string
  // 发送消息的 URL，在子类的构造函数中构造部分值（即不含 token，在实际发送消息时加上 token）
  protected sendURL: string

  constructor(tokenURL: string, sendURL: string) {
    this.tokenURL = tokenURL
    this.sendURL = sendURL
  }

  /**
   * 保存推送的 token 的信息
   * token、过期时间（为 返回的过期间隔（秒）* 1000 + 当前时间戳）
   */
  protected tokenInfo = {token: "", expires: 0}

  /**
   * 获取微信推送的 token
   */
  protected async getToken(): Promise<Error | null> {
    // token 还有效，不需要获取、更新
    if (this.tokenInfo.token && new Date().getTime() < this.tokenInfo.expires) {
      console.log("[Utils] 微信 token 可继续使用，直接返回")
      return null
    }

    let resp = await fetch(this.tokenURL)
    let obj: TokenResult = await resp.json()
    if (!obj["access_token"]) {
      return new Error("获取微信推送的 token 时出错：" + JSON.stringify(obj))
    }

    this.tokenInfo.token = obj["access_token"]
    this.tokenInfo.expires = new Date().getTime() + (obj["expires_in"] - 180) * 1000
    return null
  }

  /**
   * 推送消息
   * @param data 推送的数据
   */
  protected async push(data: object): Promise<Error | null> {
    // 判断是否更新 token
    let err = await this.getToken()
    if (err) {
      return err
    }

    // 推送消息
    let resp = await request(this.sendURL + this.tokenInfo.token, data)
    let obj: PushResult = await resp.json()

    if (obj.errcode !== 0) {
      return new Error(`推送微信消息出错，使用 token "${this.tokenInfo.token}"：${JSON.stringify(obj)}`)
    }
    return null
  }
}
