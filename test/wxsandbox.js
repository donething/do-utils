'use strict';

const {WXSandbox} = require("../dist/wxpush/sandbox");
const {WXQiYe} = require("../dist/wxpush/qiye");

describe('WXSandbox function test', () => {
  it('should return null', async () => {
    let sb = new WXSandbox("xxx", "xxx");
    let error = await sb.pushTpl("xxx",
      "xxx", "测试标题", "测试内容");
    if (error != null) {
      console.log("发送消息出错：", error);
    }
  });
});

describe('QiYeWX function test', () => {
  it('should return null', async () => {
    let qy = new WXQiYe("xx", "xxx");
    let error = await qy.pushText("xxxx", "测试内容", "admin");
    if (error != null) {
      console.log("发送消息出错：", error);
    }
  });
});