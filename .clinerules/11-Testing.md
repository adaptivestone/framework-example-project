# Node.js Test Conventions

This project uses Node's built-in test runner with the framework's per-run Mongo
and per-file server lifecycle.

## Server readiness

`src/tests/setupNodeTest.ts` preloads the framework lifecycle. Node.js may run
sibling root-level `before()` hooks concurrently, so application setup that
needs framework state must await the shared readiness gate:

```ts
import { ensureTestServerReady } from '@adaptivestone/framework/tests/testHelpers.js';
import { before } from 'node:test';

before(async () => {
  await ensureTestServerReady();
  // Config, models, appInstance, and HTTP are ready here.
});
```

The helper is idempotent and shares one startup promise with the framework
preload. Setup used by only one test file should instead live inside that
file's relevant `describe()`.

## Assertions and mocks

- `t.plan(n)` tracks `t.assert.*` calls and subtests. It does not track calls
  made through a separately imported `node:assert`; do not mix the two styles
  in a planned test.
- `assert.partialDeepStrictEqual()` uses subset semantics for arrays. Assert
  exact array length separately when extra elements must fail. Use the
  two-argument `assert.rejects(promise, pattern)` form for errors, and compare
  selected Mongoose document fields rather than partially matching the raw
  document object.
- Consecutive `mockImplementationOnce()` calls made before the first invocation
  target the same next call. Pass explicit zero-based `onCall` indices when
  registering a sequence.
- For overloaded TypeScript methods, `mock.calls[n].arguments` may be typed as
  a different overload. Prefer public-result assertions; if argument inspection
  is necessary, keep an `unknown`-first tuple cast local to the assertion.

## Coverage

`npm run test:ci` enforces its line, branch, and function thresholds and writes
LCOV output. A below-threshold run exits non-zero even with both configured
reporters; do not lower a threshold merely to make a failing pipeline green.
