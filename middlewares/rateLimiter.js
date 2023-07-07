const rateLimiter = require('express-rate-limit');

module.exports = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Слишком много запросов, попробуйте позже' },
});
