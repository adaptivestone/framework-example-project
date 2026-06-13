import originalAuth from '@adaptivestone/framework/config/auth.js';

export default {
  ...originalAuth,
  isAuthWithVerificationFlow: false,
};
