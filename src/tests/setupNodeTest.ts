// Order matters: the project's test-server options must be declared before the
// framework glue boots the server. See ./configureServer.ts.
import './configureServer.ts';
import './setup.ts';
import '@adaptivestone/framework/tests/setupNodeTest.js';
import './setupHooks.ts';
