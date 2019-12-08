const AbstractController = require('ads-framework/modules/AbstractController');
const PrepareAppInfo = require('ads-framework/services/http/middleware/PrepareAppInfo');
const Mailer = require('ads-framework/services/messaging').email;


class Email extends AbstractController {
    get routes() {
        return {
            get: {
                "/:email": "getEmail",
            }
        };

    }


    async getEmail(req,res, next){

        // TODO error check, pass params check. This is just for testing emails, not producftion ready
        const mail = new Mailer(
            req.appInfo.app,
            req.params.email,
            req.query,
            req.i18n,
        );
        const result = await mail.send("test@mail.com");
        return res.status(200).json(result);

    }


    static get middleware(){
        return new Map([[
            "/",[PrepareAppInfo]
        ]]);
    }


}

module.exports = Email;