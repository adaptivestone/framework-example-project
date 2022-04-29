const originalAuth = require('@adaptivestone/framework/config/auth');

module.exports = {
  ...originalAuth,
  isAuthWithVefificationFlow: false,
  inviteValidDays: 14,
  otpValidMs: 1000 * 60 * 5, // 5 minutes
};
