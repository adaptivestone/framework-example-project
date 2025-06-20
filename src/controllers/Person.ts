import AbstractController from '@adaptivestone/framework/modules/AbstractController.js';

import type { FrameworkRequest } from '@adaptivestone/framework/services/http/HttpServer.d.ts';
import type { Response } from 'express';
import type {TPerson} from '../models/Person.ts'

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

  async getPerson(req: FrameworkRequest, res: Response) {
    const PersonModel = req.appInfo.app.getModel('Person') as TPerson;
    let person = await PersonModel.findOne({ lastName: 'Show' });

    if (!person) {
      // just for demo
      person = await PersonModel.create({
        firstName: 'Jon',
        lastName: 'Snow',
      });
    }
    try {
      await person.sendCreatEmail(req.appInfo.i18n!);
    } catch (e) {
      if (e instanceof Error) {
        this.logger?.error(e.message);
      } else {
        this.logger?.error('An unknown error occurred');
      }
    }
    return res.status(200).json(person);
  }

  static get middleware() {
    return new Map([['/{*splat}', []]]);
  }
}

export default Person;
