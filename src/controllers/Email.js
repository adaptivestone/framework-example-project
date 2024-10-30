import AbstractController from '@adaptivestone/framework/modules/AbstractController.js';
import { email as Mailer } from '@adaptivestone/framework/services/messaging/index.js';

class Email extends AbstractController {
  // eslint-disable-next-line class-methods-use-this
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
  async getEmail(req, res) {
    // TODO error check, pass params check. This is just for testing emails, not producftion ready
    const mail = new Mailer(
      req.appInfo.app,
      req.params.email,
      req.query,
      req.i18n,
    );
    const result = await mail.send('test@mail.com');
    return res.status(200).json(result);
  }

  static get middleware() {
    return new Map([['/{*splat}', []]]);
  }
}

export default Email;
