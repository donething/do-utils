const {expect} = require("chai")
const {date} = require("../dist/main")

describe('date function test', () => {
  it('should return "2021-11-17 22:37:19"', () => {
    const result = date(new Date(1637159839237))
    expect(result).to.equal("2021-11-17 22:37:19")
  })
})

