import originalHttpConfig from '@adaptivestone/framework/config/http.js';

export default {
  ...originalHttpConfig,
  corsDomains: ['http://localhost:3000', 'http://localhost:3300'],
}; // overwrite sample
