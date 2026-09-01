import type { BootHttpHook } from '@adaptivestone/framework/server.js';
import type { Request, Response } from 'express';

/**
 * App-wide routes, webhooks, and HTTP lifecycle wiring that do not belong to an
 * auto-loaded controller.
 *
 * It lives in its own module so the exact same hook reaches production
 * (`server.ts`) and the test server (`tests/configureServer.ts`); wiring only
 * production would leave `/health` untested and silently divergent.
 */
const bootHttp: BootHttpHook = async (app) => {
  if (!app.httpServer) {
    throw new Error('HTTP server is unavailable during bootHttp');
  }

  app.httpServer.routeRegistry.registerRoute('GET', '/health', {
    handler: (_req: Request, res: Response) =>
      res.status(200).json({ data: { status: 'ok' } }),
    meta: {
      controllerClass: 'System',
      methodName: 'health',
      description: 'Process health check',
    },
  });
};

export default bootHttp;
