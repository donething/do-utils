/**
 * 返回两数之间（包含）的随机数
 * @param  min 最小值
 * @param  max 最大值
 * @see https://www.cnblogs.com/starof/p/4988516.html
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
