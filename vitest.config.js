// eslint-disable-next-line  import-x/no-unresolved, import-x/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: [
      'node_modules/@adaptivestone/framework/dist/tests/globalSetupVitest',
    ],
    setupFiles: [
      './src/tests/setup.js',
      '@adaptivestone/framework/tests/setupVitest',
    ],
    testTimeout: 10000,
    hookTimeout: 100000,
    passWithNoTests: true,
    outputFile: './coverage/rspec.xml',
    reporters: ['default', 'junit'],
    coverage: {
      enabled: true,
      reporter: ['text', 'html', 'clover', 'json', 'cobertura'],
    },
  },
});
