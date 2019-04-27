"use strict";
const path = require("path");
let Server = require("ads-framework/server");
let server = new Server({
    folders:{
        config: path.resolve("./config"),
        models: path.resolve("./models"),
        controllers: path.resolve("./controllers"),
        views: path.resolve("./views"),
        public: path.resolve("./public"),
        locales: path.resolve("./locales"),
    }
});

server.startServer();