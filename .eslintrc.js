module.exports = {
  env: {
    commonjs: true,
    es2023: true,
    mongo: true,
  },
  extends: ['airbnb-base', 'plugin:vitest/all', 'prettier'],
  plugins: ['vitest'],
  parserOptions: {
    ecmaVersion: 2023,
  },
  rules: {
    'no-restricted-syntax': 'off',
    curly: ['error', 'all'],
    'no-underscore-dangle': 'off',
    'import/extensions': 'off', // it have a problem with dynamic imports
  },
};
