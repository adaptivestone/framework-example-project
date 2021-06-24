const AbstractModel = require('@adaptivestone/framework/modules/AbstractModel');
const Mailer = require('@adaptivestone/framework/services/messaging').email;

class Person extends AbstractModel {
  // https://mongoosejs.com/docs/advanced_schemas.html

  // eslint-disable-next-line class-methods-use-this
  get modelSchema() {
    return {
      firstName: String,
      lastName: String,
    };
  }

  // `fullName` becomes a virtual
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(v) {
    const firstSpace = v.indexOf(' ');
    [this.firstName] = v.split(' ');
    this.lastName = firstSpace === -1 ? '' : v.substr(firstSpace + 1);
  }

  // `getFullName()` becomes a document method
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // `findByFullName()` becomes a static
  static findByFullName(name) {
    const firstSpace = name.indexOf(' ');
    const firstName = name.split(' ')[0];
    const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
    return this.findOne({ firstName, lastName });
  }

  async sendCreatEmail(i18n) {
    const mail = new Mailer(
      this.constructor.getSuper().app,
      'verification',
      {
        fullName: `${this.firstName} ${this.lastName}`,
      },
      i18n,
    );
    this.email = 'test@example.com';
    return mail.send(this.email);
  }
}

module.exports = Person;
