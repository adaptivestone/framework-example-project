const originalHttpConfig = require('@adaptivestone/framework/config/http');

module.exports = {
  ...originalHttpConfig,
  corsDomains: ['http://localhost:3000', 'http://localhost:3300'],
}; // overwrite sample
