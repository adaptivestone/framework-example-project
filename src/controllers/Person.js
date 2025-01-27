import AbstractController from '@adaptivestone/framework/modules/AbstractController.js';

class Person extends AbstractController {
  get routes() {
    return {
      get: {
        '/': {
          handler: this.getPerson,
        },
      },
    };
  }

  async getPerson(req, res) {
    const PersonModel = req.appInfo.app.getModel('Person');
    let person = await PersonModel.findOne({ lastName: 'Show' });

    if (!person) {
      // just for demo
      person = await PersonModel.create({
        firstName: 'Jon',
        lastName: 'Snow',
      });
    }
    try {
      await person.sendCreatEmail(req.i18n);
    } catch (e) {
      this.logger.error(e.message);
    }
    return res.status(200).json(person);
  }

  static get middleware() {
    return new Map([['/{*splat}', []]]);
  }
}

export default Person;
