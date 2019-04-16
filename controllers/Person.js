const AbstractController = require('ads-framework/modules/AbstractController');
const PrepareAppInfo = require('ads-framework/services/http/middleware/PrepareAppInfo');

class Person extends AbstractController {
    get routes() {
        return {
            get: {
                "/": "getPerson",
            }
        };

    }

    async getPerson(req, res, next) {
        let Person = req.appInfo.app.getModel("Person");
        let person = await Person.findOne({lastName:"Show"});

        if (!person){// just for demo
            person = await Person.create({
                firstName: "Jon",
                lastName: "Snow"
              });
        }

        res.render("person", {person:person});//pass person here ES6 feature
    }


    static get middleware(){
        return new Map([[
            "/",[PrepareAppInfo]
        ]]);
    }


}

module.exports = Person;