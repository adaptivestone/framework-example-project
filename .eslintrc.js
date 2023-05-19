module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    'jest/globals': true,
    mongo: true,
  },
  extends: ['airbnb-base', 'plugin:jest/all', 'prettier'],
  plugins: ['jest'],
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
    'jest/no-hooks': 'off',
    'jest/require-hook': 'off',
    'no-underscore-dangle': 'off',
  },
};
