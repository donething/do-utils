// Telegram 消息发送

/**
 * 需发送的媒体对象
 */
export type Media = {
  // 媒体文件，可以为下列 3 种值：
  // URL TG 将下载到其服务器<br>
  // attach://<file_attach_name> 将在表单中上传二进制文件，此处 <file_attach_name> 需对应文件表单的键
  // file_id 在相同的聊天频道中已存在媒体文件的 ID
  media: string

  // 媒体的数据类型，必为"audio"、"document"、"photo"或"video"
  type: string

  // 媒体的标题，解析后字符数需在 0-1024 之间
  caption: string

  // 标题的解析模式
  parse_mode: string
}

/**
 * 媒体类型
 */
export type MediaType = {
  AUDIO: "audio",
  DOCUMENT: "document",
  PHOTO: "photo",
  VIDEO: "video"
}

/**
 * `TGSender.sendMediaGroup` 发送的原始媒体信息
 */
export type MediaOrigin = {
  // 媒体的地址
  media: string
  // 媒体的类型
  type: MediaType
  // 媒体的标题
  caption: string
  // 标题的解析模式
  parse_mode: string
  // 标题中特殊实体的列表，可以指定代替 parse_mode
  caption_entities: string
}

/**
 * TG 消息推送类
 */
export class TGSender {
  // 机器人的 token
  readonly token: string = ""

  // 机器人的 token，最前面不要加"bot"
  constructor(token: string) {
    this.token = "bot" + token
  }

  /**
   * sendMessage 将文本消息发送到频道
   *
   * @param  chat_id 聊天室频道的 ID
   * @param text 消息文本
   * @param parse_mode 解析模式，默认 Markdown
   */
  async sendMessage(chat_id: string, text: string, parse_mode = "markdown"): Promise<boolean> {
    // 设置将 POST 到 TG 的数据
    let data = {chat_id: String(chat_id), text: text, parse_mode: parse_mode}

    // 发送请求，解析响应
    let ops = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
    let resp = await fetch(`https://api.telegram.org/${this.token}/sendMessage`, ops)
    let result = await resp.json()

    return result.ok
  }

  /**
   * sendMediaGroup 将一组照片、视频、文档或音频作为合集发送频道
   * 可传递第一个文档的 caption、parse_mode 来设置合集的标题
   * @param  chat_id 聊天室频道的 ID
   * @param mediaOrignList 媒体合集
   */
  async sendMediaGroup(chat_id: string, mediaOrignList: Array<MediaOrigin>) {
    // 将发送的表单
    let form = new FormData()
    // 设置表单 chat_id
    form.append("chat_id", String(chat_id))

    // 存放媒体信息的数组，作为表单项发送
    let formMedias = []
    for (const [i, m] of mediaOrignList.entries()) {
      // 鉴于 TG 服务器下载文件的苛刻条件，即使媒体链接为下载地址，也先下载再发送二进制文件
      if (/(https?|ftps?):\/\//.test(m.media)) {
        // 获取媒体文件的二进制数据，添加到表单
        let resp = await fetch(m.media)
        form.append(String(i), await resp.blob())
        // 修改媒体的地址为附件上传方式，注意"attach://"后面的值需要与上条语句的表单的键一样
        m.media = `attach://${i}`
      }
      // 无论传递什么格式的媒体地址，都需要新疆原始媒体信息作为表单发送
      formMedias.push(m)
    }

    // 设置表单 media
    form.append("media", JSON.stringify(formMedias))

    // 发送请求，解析响应
    let ops = {
      method: "POST",
      body: form
    }
    let resp = await fetch(`https://api.telegram.org/${this.token}/sendMediaGroup`, ops)
    let result = await resp.json()

    return result.ok
  }
}