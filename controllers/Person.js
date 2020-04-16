const AbstractController = require('@adaptivestone/framework/modules/AbstractController');
const PrepareAppInfo = require('@adaptivestone/framework/services/http/middleware/PrepareAppInfo');

class Person extends AbstractController {
  // eslint-disable-next-line class-methods-use-this
  get routes() {
    return {
      get: {
        '/': 'getPerson',
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
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
      console.log(e);
    }
    return res.status(200).json(person);
  }

  static get middleware() {
    return new Map([['/', [PrepareAppInfo]]]);
  }
}

module.exports = Person;
