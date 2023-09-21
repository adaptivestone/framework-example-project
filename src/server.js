import * as Sentry from '@sentry/node';
import Server from '@adaptivestone/framework/server.js';

import folderConfig from './folderConfig.js';

Sentry.init({
  dsn: process.env.LOGGER_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
});

const server = new Server(folderConfig);

server.startServer();
