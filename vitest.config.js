// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: [
      './src/tests/setup.js',
      '@adaptivestone/framework/tests/setupVitest',
    ],
    testTimeout: 10000,
    hookTimeout: 100000,
    passWithNoTests: true,
  },
});
