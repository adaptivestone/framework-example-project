module.exports = {
  env: {
    es2023: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2023,
  },
  rules: {
    'no-restricted-syntax': 'off',
    'prettier/prettier': 'error',
    curly: ['error', 'all'],
    'no-underscore-dangle': 'off',
    'import/extensions': 'off', // it have a problem with dynamic imports
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      extends: ['plugin:vitest/all', 'plugin:vitest/recommended'],
      plugins: ['vitest'],
    },
  ],
};
