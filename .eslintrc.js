module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    mongo: true,
  },
  extends: ['airbnb-base', 'plugin:vitest/all', 'prettier'],
  plugins: ['vitest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-restricted-syntax': 'off',
    curly: ['error', 'all'],
    'no-underscore-dangle': 'off',
  },
};
