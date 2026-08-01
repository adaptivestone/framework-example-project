import { describe, it, type TestContext } from 'node:test';
import { appInstance } from '@adaptivestone/framework/helpers/appInstance.js';

describe('typed config', () => {
  it('widens homogeneous generated config arrays independently of length', (t: TestContext) => {
    const { corsDomains } = appInstance.getConfig('http');
    const domains: string[] = corsDomains;

    t.assert.deepStrictEqual(domains, [
      'http://localhost:3000',
      'http://localhost:3300',
    ]);
  });
});
