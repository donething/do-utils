const {readFileSync} = require("fs")
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')

module.exports = [
  {
    input: "./src/main.ts",
    output: [
      {
        file: packageJson.main,
        format: "umd",
        sourcemap: true,
        name: "doutils"
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),  // 查找和打包 node_modules 中的第三方模块
      commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
      typescript({tsconfig: "./tsconfig.json"}),  // 解析TypeScript
    ],
    external: [],
  }
]
