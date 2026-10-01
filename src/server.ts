import Server from '@adaptivestone/framework/server.js';
import * as Sentry from '@sentry/node';

import bootHttp from './bootHttp.ts';
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
  // Sentry 11 collects request bodies, headers, cookies, query strings and
  // stack-frame variables by default — here that includes passwords and
  // bearer tokens. This keeps the v10 privacy level; relax it deliberately.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    },
    httpBodies: [],
    urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false },
    stackFrameVariables: false,
  },
});

const server = new Server({
  ...folderConfig,
  bootHttp,
});

await server.startServer();
