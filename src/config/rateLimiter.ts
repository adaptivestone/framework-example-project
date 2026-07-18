import defaults from '@adaptivestone/framework/config/rateLimiter.js';

export default {
  ...defaults,
  policy: {
    personCreate: {
      limiterOptions: {
        points: 3,
        duration: 60 * 60,
      },
    },
  },
};
