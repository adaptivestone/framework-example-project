import Server from '@adaptivestone/framework/server.js';
import * as Sentry from '@sentry/node';

import folderConfig from './folderConfig.ts';

Sentry.init({
  dsn: process.env.LOGGER_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [],
});

const server = new Server(folderConfig);

await server.startServer();

// you can put any additional logic here like adding websoket, etc
