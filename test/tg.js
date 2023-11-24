const {expect} = require("chai")
const {TGSender} = require("../dist/main")

describe('tg escapeMk legalMk function test', () => {
  it('should return "测\\#试Markdown文本\\*消息\\*结束"', async () => {
    const result = TGSender.escapeMk("测#试Markdown文本*消息*结束")
    expect(result).to.equal("测\\#试Markdown文本\\*消息\\*结束")
  })

  it('should return "测\\#试"', async () => {
    const result = TGSender.escapeMk("测#试")
    expect(result).to.equal("测\\#试")
  })
})

describe('tg legalMk function test', () => {
  it('should return "测\\#试"', async () => {
    const result = TGSender.escapeMk("测#试")
    expect(result).to.equal("测\\#试")
  })
})

describe('tg sendMsg function test', () => {
  it('should return "测\\#试"', async () => {
    const tg = new TGSender("xxx")
    const response = await tg.sendMessage("yyy", "xxxxxx")

    if (!response.ok) {
      console.log("推送 TG 消息失败：", response.error_code, response.description)
    }
  })
})