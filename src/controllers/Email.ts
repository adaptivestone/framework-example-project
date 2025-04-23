import AbstractController from '@adaptivestone/framework/modules/AbstractController.js';
import Mailer from '@adaptivestone/framework-module-email';

import type { FrameworkRequest } from '@adaptivestone/framework/services/http/HttpServer.d.ts';
import type { Response } from 'express';

class Email extends AbstractController {
  get routes() {
    return {
      get: {
        '/:email': {
          handler: this.getEmail,
        },
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async getEmail(req: FrameworkRequest, res: Response) {
    // TODO error check, pass params check. This is just for testing emails, not producftion ready
    const mail = new Mailer(
      req.appInfo.app,
      req.params.email,
      req.query,
      req.appInfo.i18n,
    );
    const result = await mail.send('test@mail.com');
    return res.status(200).json(result);
  }

  static get middleware() {
    return new Map([['/{*splat}', []]]);
  }
}

export default Email;
