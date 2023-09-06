const path = require('path');

process.env.TEST_FOLDER_CONFIG = path.resolve(__dirname, '../config');
process.env.TEST_FOLDER_CONTROLLERS = path.resolve(__dirname, '../controllers');
process.env.TEST_FOLDER_VIEWS = path.resolve(__dirname, '../views');
process.env.TEST_FOLDER_PUBLIC = path.resolve(__dirname, '../public');
process.env.TEST_FOLDER_MODELS = path.resolve(__dirname, '../models');
process.env.TEST_FOLDER_EMAILS = path.resolve(
  __dirname,
  '../services/messaging/email/templates',
);

global.testSetup = {
  disableUserCreate: true,
  beforeAll: async () => {
    process.env.LOGGER_CONSOLE_LEVEL = 'error';
    // todo create users here
  },
};
