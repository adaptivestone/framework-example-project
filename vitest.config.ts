// eslint-disable-next-line import-x/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: [
      'node_modules/@adaptivestone/framework/dist/tests/globalSetupVitest',
    ],
    setupFiles: [
      './src/tests/setup.ts',
      '@adaptivestone/framework/tests/setupVitest',
      './src/tests/setupHooks.ts',
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
