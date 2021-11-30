'use strict';

const expect = require('chai').expect;
const {date, day} = require("../dist/utils");
const {request} = require("../dist/utils");

describe('date function test', () => {
  it('should return "2021/11/17 22:37:19"', () => {
    const result = date({date: new Date(1637159839237)});
    expect(result).to.equal("2021/11/17 22:37:19");
  });
});

describe('day function test', () => {
  it('should return "20211117"', () => {
    const result = day(new Date(1637159839237));
    expect(result).to.equal("20211117");
  });
});

describe('request function test GET', () => {
  it('should contain "Example Domain"', async () => {
    const resp = request("http://example.com/");
    const result = (await resp).text();
    expect(result).to.contain("Example Domain");
  });
});
