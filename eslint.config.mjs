import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        uni: 'readonly',
        uniCloud: 'readonly',
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: { vue: pluginVue },
    rules: {
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'always'
      ],
      'space-unary-ops': [ //空格
        1, {
          'words': true, //一元运算符 new, delete, typeof, void, yield
          'nonwords': false, //二元运算符  -, +, --, ++, !, !!
          'overrides': {}
        }
      ],
      'space-infix-ops': [ //操作符空额，如 =
        1
      ],
      'no-trailing-spaces': 'error', //前后无多余空格
      'comma-spacing': ['error', { //逗号后空格
        'before': false,
        'after': true
      }],
      'comma-style': ['error', 'last'], //逗号只能在结尾处
      'key-spacing': ['error', { 'mode': 'strict' }], //对象关键字冒号后空格，
      'object-curly-newline': ['error', {
        'minProperties': 2,
        'multiline': true
      }],
      'object-curly-spacing': ['error', 'always'], //对象括号前后空格
      'object-property-newline': 'error',
      'space-before-blocks': 'error', //块前空格,
      'space-before-function-paren': ['error'], //函数定义括号前空格
      'arrow-spacing': ['error', {
        'before': true,
        'after': true
      }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: { 'indent': ['error', 2] }
  },
  // Vue 文件的缩进规则
  {
    files: ['**/*.vue'],
    rules: {
      'vue/script-indent': ['error', 2, { baseIndent: 1 }],
      'vue/multi-word-component-names': 'off'
    }
  }
];