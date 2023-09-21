import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  folders: {
    config: path.resolve(__dirname, './config'),
    models: path.resolve(__dirname, './models'),
    controllers: path.resolve(__dirname, './controllers'),
    views: path.resolve(__dirname, './views'),
    public: path.resolve(__dirname, './public'),
    locales: path.resolve(__dirname, './locales'),
    emails: path.resolve(__dirname, './services/messaging/email/templates'),
    commands: path.resolve(__dirname, './commands'),
    migrations: path.resolve(__dirname, './migrations'),
  },
};
