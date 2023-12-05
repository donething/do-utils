/**
 * 将 try catch 的参数 e 转为 Error 类型
 * @param err unknown 类型的 err
 */
export const typeError = (err: any): Error => {
  if (typeof err === "string") {
    return new Error(err)
  } else if (err instanceof Error) {
    return err
  } else if (err instanceof Object) {
    return new Error(JSON.stringify(err))
  }

  return new Error(err.toString())
}
