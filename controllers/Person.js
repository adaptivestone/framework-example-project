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
        try {
            await person.sendCreatEmail(req.i18n);
        }catch (e) {
                console.log(e);
        }
        return res.status(200).json(person);
    }


    static get middleware(){
        return new Map([[
            "/",[PrepareAppInfo]
        ]]);
    }


}

module.exports = Person;