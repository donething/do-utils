const {expect} = require("chai")
const {random} = require("../dist/main")

describe('random function test', () => {
  it('should within [300, 305]', () => {
    const num = random(300, 305)
    expect(num).to.within(300, 305)
  })
})
