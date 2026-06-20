import path from 'node:path';
// Register custom email template engines so emails render during tests.
import '../services/messaging/email/registerEngines.ts';

const here = import.meta.dirname;

process.env.TEST_FOLDER_CONFIG = path.resolve(here, '../config');
process.env.TEST_FOLDER_CONTROLLERS = path.resolve(here, '../controllers');
process.env.TEST_FOLDER_MODELS = path.resolve(here, '../models');
process.env.TEST_FOLDER_EMAILS = path.resolve(
  here,
  '../services/messaging/email/templates',
);
