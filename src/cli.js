const Cli = require('@adaptivestone/framework/Cli');
const folderConfig = require('./folderConfig');

const cli = new Cli(folderConfig);

cli.run();
