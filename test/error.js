const {expect} = require("chai")
const {typeError} = require("../dist/main")

describe('typeError function test', () => {
  it('should return true', () => {
    const obj = {a: 123}
    const result = typeError(obj)
    expect(result).to.be.an.instanceof(Error)
  })
})
