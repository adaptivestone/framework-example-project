const originalAuth = require('@adaptivestone/framework/config/auth');

module.exports = {
  ...originalAuth,
  isAuthWithVefificationFlow: false,
};
