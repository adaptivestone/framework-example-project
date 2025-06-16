import Mailer from '@adaptivestone/framework-module-email';
import { BaseModel } from '@adaptivestone/framework/modules/BaseModel.js';
import { appInstance } from '@adaptivestone/framework/helpers/appInstance.js';
import type {
  GetModelTypeFromClass,
  GetModelTypeLiteFromSchema,
} from '@adaptivestone/framework/modules/BaseModel.js';
import type { TFunction } from 'i18next';

export type TPerson = GetModelTypeFromClass<typeof Person>;
export type TPersonLite = GetModelTypeLiteFromSchema<typeof Person.modelSchema>;

class Person extends BaseModel {
  static get modelSchema() {
    return {
      firstName: String,
      lastName: String,
      email: String,
    };
  }

  /**
   * const Person = appInstance.getModel('Person');
   * const person = await SomeModel.findOne({email:"cfff"});
   * const data = await person.sendCreatEmail({t, 'en'}); // call instance method
   */
  static get modelInstanceMethods() {
    return {
      sendCreatEmail: async function sendCreatEmail(
        this: InstanceType<TPersonLite>,
        i18n: { t: TFunction; language: string },
      ) {
        const mail = new Mailer(
          appInstance,
          'verification',
          {
            fullName: `${this.firstName} ${this.lastName}`,
          },
          i18n,
        );
        this.email = 'test@example.com';
        return mail.send(this.email);
      },
    } as const;
  }

  /**
   *  Object with static methods.
   * this.app.getModel('SomeModel').findByEmail('email');
   * this.app.getModel('SomeModel').getInfoStatic();
   *
   */
  static get modelStatics() {
    return {
      findByFullName: async function findByFullName(
        this: TPersonLite, // A type helper to map to the correct `this` context.
        fullName: string,
      ) {
        const firstSpace = fullName.indexOf(' ');
        const firstName = fullName.split(' ')[0];
        const lastName =
          firstSpace === -1 ? '' : fullName.substring(firstSpace + 1);
        return this.findOne({ firstName, lastName });
      },
    };
  }

  // virtual field
  static get modelVirtuals() {
    return {
      fullName: {
        // schema
        options: {
          type: String,
        } as const,
        // Getter
        get(this: InstanceType<TPersonLite>) {
          return `${this.firstName} ${this.lastName}`;
        },
        // Setter
        async set(this: InstanceType<TPersonLite>, v: string) {
          const firstName = v.substring(0, v.indexOf(' '));
          const lastName = v.substring(v.indexOf(' ') + 1);
          this.set({ firstName, lastName });
        },
      },
    };
  }
}

export default Person;
