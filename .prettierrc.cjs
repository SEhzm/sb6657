/**
 * 项目统一的 Prettier 配置
 * 偏好：4 空格缩进、单引号、尽量加分号、模板长行再换行
 */
module.exports = {
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
  printWidth: 200,
  tabWidth: 4,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: 'ignore',
  singleAttributePerLine: false,
  vueIndentScriptAndStyle: true,
};