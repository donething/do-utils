const {expect} = require("chai")
const {WeiboUtility} = require("../dist/main")

describe('WeiboUtility function test', () => {
  it('should return "MzVRA2E8G"', async () => {
    const str = WeiboUtility.id2Mid("4885639100630954")
    console.log(str)
    expect(str).to.equal("MzVRA2E8G")
  })

  it('should return "4885639100630954"', async () => {
    const str = WeiboUtility.mid2id("MzVRA2E8G")
    console.log(str)
    expect(str).to.equal("4885639100630954")
  })
})
