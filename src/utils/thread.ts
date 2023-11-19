/**
 * 等待指定的毫秒时间
 *
 * 用法为: await sleep(1000) 或 sleep(1000).then(...)
 * @param time 毫秒数
 */
export const sleep = async (time: number) => {
  await new Promise(resolve => setTimeout(resolve, time))
}