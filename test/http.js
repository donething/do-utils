const {expect} = require("chai")
const {request, parseSetCookie} = require("../dist/main")

describe('request function test', () => {
  it('should contain "Example Domain"', async () => {
    const resp = await request("https://example.com/")
    const result = await resp.text()
    expect(result).to.includes("Example Domain")
  })
})

describe('parseSetCookie function test', () => {
  it('should contain "用戶名"', async () => {
    const str = 'flash_msg=<b>錯誤</b>: 用戶名或密碼不正確！或者你還沒有通過驗證<br /><br />忘記了密碼？' +
      '<b><a href=recover.php>找回</a></b>你的密碼？; expires=Wed, 22-Nov-2023 09:50:56 GMT; Max-Age=60; path=/'
    const result = parseSetCookie([str])
    expect(result["flash_msg"]).to.includes("用戶名")
  })
})
