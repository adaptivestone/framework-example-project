const Sentry = require('@sentry/node');
require('@sentry/tracing');

Sentry.init({
  dsn: process.env.LOGGER_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

const Server = require('@adaptivestone/framework/server');
const folderConfig = require('./folderConfig');

const server = new Server(folderConfig);

server.startServer();
