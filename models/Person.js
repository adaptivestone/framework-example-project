"use strict";
const AbstractModel = require("ads-framework/modules/AbstractModel");

class Person extends AbstractModel {
  //https://mongoosejs.com/docs/advanced_schemas.html

  get modelSchema() {
    return {
        firstName: String,
        lastName: String
    };
  }

  // `fullName` becomes a virtual
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(v) {
    const firstSpace = v.indexOf(" ");
    this.firstName = v.split(" ")[0];
    this.lastName = firstSpace === -1 ? "" : v.substr(firstSpace + 1);
  }

  // `getFullName()` becomes a document method
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // `findByFullName()` becomes a static
  static findByFullName(name) {
    const firstSpace = name.indexOf(" ");
    const firstName = name.split(" ")[0];
    const lastName = firstSpace === -1 ? "" : name.substr(firstSpace + 1);
    return this.findOne({ firstName, lastName });
  }
}

module.exports = Person;
