import type { BootHttpHook } from '@adaptivestone/framework/server.js';
import type { Request, Response } from 'express';

/**
 * App-wide routes, webhooks, and HTTP lifecycle wiring that do not belong to an
 * auto-loaded controller.
 *
 * It lives in its own module so the exact same hook reaches production
 * (`server.ts`) and the test server (`tests/configureServer.ts`); wiring only
 * production would leave the webhook untested and silently divergent.
 */
const bootHttp: BootHttpHook = async (app) => {
  if (!app.httpServer) {
    throw new Error('HTTP server is unavailable during bootHttp');
  }

  // A provider webhook: an app-wide endpoint that belongs to no controller.
  // Verify the provider's signature before trusting the payload; compare
  // secrets with `timingSafeEqualStrings` from
  // `@adaptivestone/framework/helpers/crypto.js`. Health checks need no route
  // here: the framework serves `/health/live` and `/health/ready`.
  app.httpServer.routeRegistry.registerRoute('POST', '/webhooks/example', {
    handler: (_req: Request, res: Response) =>
      res.status(202).json({ data: { received: true } }),
    meta: {
      controllerClass: 'System',
      methodName: 'exampleWebhook',
      description: 'Example provider webhook',
    },
  });
};

export default bootHttp;
