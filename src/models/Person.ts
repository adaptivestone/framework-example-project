import AbstractModel from '@adaptivestone/framework/modules/AbstractModel.js';
import Mailer from '@adaptivestone/framework-module-email';

import type {
  IAbstractModel,
  IAbstractModelMethods,
} from '@adaptivestone/framework/modules/AbstractModel.d.ts';

import type { TFunction } from 'i18next';

interface IPerson {
  firstName: string;
  lastName: string;
  email: string;
}

interface IStatic
  extends IAbstractModel<IPerson, IAbstractModelMethods<IPerson>> {
  getFullName(): string;
}

class Person
  extends AbstractModel<IPerson, IAbstractModelMethods<IPerson>, IStatic>
  implements IPerson
{
  // Declare properties from IPerson to satisfy TypeScript
  firstName!: string;
  lastName!: string;
  email!: string;

  // https://mongoosejs.com/docs/advanced_schemas.html

  // eslint-disable-next-line class-methods-use-this
  get modelSchema() {
    return {
      firstName: String,
      lastName: String,
      email: String,
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
  static findByFullName(this: Person['mongooseModel'], name: string) {
    const firstSpace = name.indexOf(' ');
    const firstName = name.split(' ')[0];
    const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
    return this.findOne({ firstName, lastName });
  }

  async sendCreatEmail(
    this: InstanceType<Person['mongooseModel']>,
    i18n: { t: TFunction; language: string },
  ) {
    const mail = new Mailer(
      this.getSuper().app,
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

export default Person;
