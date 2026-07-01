const js = require('@eslint/js');
const globals = require('globals');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const vue = require('eslint-plugin-vue');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        ignores: ['node_modules/**', 'dist/**', 'public/**', '.vercel/**', '.vscode/**', '*.min.js'],
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
        },
    },
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended'],
    ...vue.configs['flat/recommended'],
    prettierConfig,
    {
        files: ['src/**/*.{ts,tsx,js,jsx,vue}'],
        rules: {
            'vue/max-attributes-per-line': 'off',
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-unsafe-function-type': 'warn',
            'no-empty': 'warn',
            'no-self-assign': 'warn',
            'no-undef': 'off',
            'no-useless-escape': 'warn',
            'prefer-const': 'warn',
            'vue/no-dupe-keys': 'warn',
            'vue/no-side-effects-in-computed-properties': 'warn',
            'vue/no-unused-vars': 'warn',
            'vue/valid-template-root': 'warn',
        },
    },
    {
        files: ['src/**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
        },
    },
];
