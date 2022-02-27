# do-utils

## tg

## utils

## 企业微信、微信测试号 推送消息
### 企业微信
```typescript

```
### 微信测试号
```typescript
let sb = new WXSandbox("xxx", "xxx");
let error = await sb.pushTpl("xxx", "xxx", "测试标题", "测试内容");
if (error != null) {
  console.log("发送消息出错：", error);
}
```