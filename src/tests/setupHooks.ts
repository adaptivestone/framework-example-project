import { before } from 'node:test';
import { ensureTestServerReady } from '@adaptivestone/framework/tests/testHelpers.js';

before(async () => {
  // Root hooks from separate modules may start concurrently under node:test.
  // Await this before any application-wide setup that uses config or models.
  await ensureTestServerReady();
});
