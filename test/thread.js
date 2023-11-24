const {expect} = require("chai")
const {sleep} = require("../dist/main")

describe('sleep function test', () => {
  it('should sleep 3', async () => {
    const wait = 3  // 等待3秒
    const start = Date.now() / 1000
    await sleep(wait * 1000)
    const end = Date.now() / 1000

    expect(end).to.closeTo(start + wait, 0.1)
  }).timeout(5 * 1000)
})
