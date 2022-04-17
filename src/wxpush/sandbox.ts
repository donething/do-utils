import {WXPush} from "./wxpush"
import {date} from "../text"

// 微信测试号推送
export class WXSandbox extends WXPush {
  /**
   * 构造函数，实例化类时传递
   * @param appid 测试号信息的 id
   * @param secret 测试号信息的 secret
   */
  constructor(appid: string, secret: string) {
    super("https://api.weixin.qq.com/cgi-bin/token?" +
      `grant_type=client_credential&appid=${appid}&secret=${secret}`,
      "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="
    )
  }

  /**
   * 推送模板消息
   * @param toUID 目标用户的 ID
   * @param tplID 模板 ID
   * @param title 标题
   * @param msg 内容
   * @param url 链接
   */
  async pushTpl(toUID: string, tplID: string, title: string,
                msg: string, url?: string): Promise<Error | null> {
    // 消息的数据
    let data = {
      touser: toUID || "@all",
      template_id: tplID,
      url: url,
      data: {
        title: {value: title + "\n"},
        msg: {value: msg + "\n"},
        time: {value: date()},
      }
    }

    return this.push(data)
  }
}