// Declares this project's `Server` options for the test server, so the app-wide
// HTTP wiring `bootHttp` performs in production — the `GET /health` route — is
// present under test too, instead of silently missing.
//
// Ordering rule: `configureTestServer()` must run before the framework setup
// glue boots the server, and that boot starts one microtask after the preload
// graph finishes evaluating. Keeping the call in this module, imported at the
// top of `setupNodeTest.ts`, satisfies the rule on both runners: it is fully
// evaluated before any other preload module body, including the top-level
// `await` in the Bun-only `setupBunTest.ts` — anything declared after that
// `await` would arrive once the boot had already consumed the options.
import { configureTestServer } from '@adaptivestone/framework/tests/testHelpers.js';
import bootHttp from '../bootHttp.ts';

configureTestServer({ bootHttp });
