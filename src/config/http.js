const config = require('@adaptivestone/framework/config/http');

config.corsDomains = ['http://localhost:3000', 'http://localhost:3300']; // overwrite sample

module.exports = config;
