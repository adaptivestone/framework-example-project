const path = require("path");

process.env.TEST_FOLDER_CONFIG = path.resolve("./config");
process.env.TEST_FOLDER_CONTROLLERS = path.resolve("./controllers");
process.env.TEST_FOLDER_VIEWS = path.resolve("./views");
process.env.TEST_FOLDER_PUBLIC = path.resolve("./public");
process.env.TEST_FOLDER_MODELS = path.resolve("./models");
process.env.TEST_FOLDER_EMAILS = path.resolve("./services/messaging/email/templates");

require("ads-framework/tests/setup");