"use strict";
const path = require("path");
let Server = require("@adaptivestone/framework/server");
let server = new Server({
    folders:{
        config: path.resolve("./config"),
        models: path.resolve("./models"),
        controllers: path.resolve("./controllers"),
        views: path.resolve("./views"),
        public: path.resolve("./public"),
        locales: path.resolve("./locales"),
        emails: path.resolve("./services/messaging/email/templates")
    }
});

server.startServer();