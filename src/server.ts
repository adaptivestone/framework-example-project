import type { BootHttpHook } from '@adaptivestone/framework/server.js';
import Server from '@adaptivestone/framework/server.js';
import * as Sentry from '@sentry/node';
import type { Request, Response } from 'express';

import folderConfig from './folderConfig.ts';
// Register custom email template engines once per worker process,
// before any request can trigger an email send.
import './services/messaging/email/registerEngines.ts';

Sentry.init({
  dsn: process.env.LOGGER_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [],
});

// App-wide routes, webhooks, and HTTP lifecycle wiring that do not belong to
// an auto-loaded controller can stay next to the server that owns the hook.
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

const server = new Server({
  ...folderConfig,
  bootHttp,
});

await server.startServer();
