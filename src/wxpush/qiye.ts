import {WXPush} from "./wxpush"
import {date} from "../utils/text"

/**
 * 微信企业号的应用消息推送类
 */
export class WXQiYe extends WXPush {
  // 快速生成超链接
  static Comm = {
    // 生成超链接
    genHyperlink: (url: string, title?: string) => `<a href='${url}'>${title || url}</a>`
  }

  // 快速生成标识文本，仅适用于卡片消息
  static MsgCard = {
    // 注释（灰色）文本
    genGrayText: (text: string) => `<div class='gray'>${text}</div>`,
    // 普通（黑色）文本
    genNormalText: (text: string) => `<div class='normal'>${text}</div>`,
    // 高亮（橙红色）文本
    genHighlightText: (text: string) => `<div class='highlight'>${text}</div>`
  }

  // 快速生成标识文本，仅适用于 Markdown 消息
  static MsgMarkdown = {
    // 信息（绿色）文本
    genInfoText: (text: string) => `<font color='info'>${text}</font>`,
    // 注释（灰色）文本
    genCommentText: (text: string) => `<font color='comment'>${text}</font>`,
    // 警告（橙红色）文本
    genWarningText: (text: string) => `<font color='warning'>${text}</font>`
  }

  /**
   * 构造函数，实例化类时传递
   * @param corpid 企业 ID
   * @param corpsecret 秘钥
   */
  constructor(corpid: string, corpsecret: string) {
    super(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`,
      "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token="
    )
  }

  /**
   * 推送文本消息
   * @param agentid 应用 ID
   * @param content 消息内容，支持换行"\n"、以及超链接"A"
   * @param users 推送的目标（多个以"|"分隔），为空表示推送到所有人
   */
  async pushText(agentid: number, content: string, users = "@all"): Promise<Error | null> {
    // 消息的数据
    let data = {
      "touser": users || "@all",
      "msgtype": "text",
      "agentid": agentid,
      "text": {
        "content": content + "\n\n" + date()
      }
    }

    return this.push(data)
  }

  /**
   * 推送卡片消息
   * @param agentid 应用 ID
   * @param title 标题
   * @param description 内容。可以用"\n"换行，可用设置部分字体颜色（已提供函数快速生成），不可含超链接
   * @param users 推送的目标（多个以"|"分隔），为空表示推送到所有人
   * @param url 跳转链接。为空时自动设为 example
   * @param btnTxt 跳转标识文本（仅在企业微信中有效，在微信中无效）
   */
  async pushCard(agentid: number, title: string, description: string, users = "@all",
                 url = "", btnTxt = ""): Promise<Error | null> {
    // 消息的数据
    let data = {
      "touser": users || "@all",
      "msgtype": "textcard",
      "agentid": agentid,
      "textcard": {
        "title": title,
        "description": WXQiYe.MsgCard.genGrayText(date()) + "\n" + description,
        "url": url || "https://example.com",
        "btntxt": btnTxt
      }
    }

    return this.push(data)
  }

  /**
   * 推送 Markdown 消息（目前非企业微信不支持该类型）
   * @param agentid 应用 ID
   * @param content 目前仅支持 Markdown 语法的子集
   * @param users 推送的目标（多个以"|"分隔），为空表示推送到所有人
   * @see https://developer.work.weixin.qq.com/document/path/90236#markdown%E6%B6%88%E6%81%AF
   */
  async pushMarkdown(agentid: number, content: string, users = "@all"): Promise<Error | null> {
    // 消息的数据
    let data = {
      "touser": users || "@all",
      "msgtype": "markdown",
      "agentid": agentid,
      "markdown": {
        "content": content
      }
    }

    return this.push(data)
  }
}
