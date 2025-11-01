/**
 * ESLint 配置：Vue 3 + TypeScript + Prettier
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['@typescript-eslint', 'vue', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    // 与你的偏好对齐
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        tabWidth: 4,
        printWidth: 200,
        bracketSameLine: true,
      },
    ],
    // Vue 模板属性一行多个
    'vue/max-attributes-per-line': ['off'],
    // 组件命名风格保持宽松
    'vue/multi-word-component-names': 'off',
    // TS：允许 any 在必要处使用
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许未使用的变量以下划线开头（常见占位）
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};