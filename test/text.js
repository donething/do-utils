import {sha256, date, truncateStr} from "../dist/main.es.js";
import {expect} from "chai";

describe('sha256 function test', () => {
  it('should return "8bc7effec4d3400515b7b366ef5c5edac186389ea4d03d45e7bbe2233e47f707"', async () => {
    const result = await sha256("测试abc123");
    expect(result).to.equal("8bc7effec4d3400515b7b366ef5c5edac186389ea4d03d45e7bbe2233e47f707");
  });
});

describe('date function test', () => {
  it('should return "2022-03-30 22:50:39"', async () => {
    const result = date(new Date("2022-03-30 22:50:39"));
    expect(result).to.equal("2022-03-30 22:50:39");
  });
});

describe('truncateStr function test', () => {
  it('should return "测试...串"', async () => {
    const result = truncateStr("测试长字符串", 61);
    console.log("结果", result);
    expect(result).to.equal("测试...串");
  });
});