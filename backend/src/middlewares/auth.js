const isValidAuthToken = require('@/controllers/middlewaresControllers/createAuthMiddleware/isValidAuthToken');

const protect = (req, res, next) => {
  return isValidAuthToken(req, res, next, {
    userModel: 'Admin', // or 'User' if you're protecting client user endpoints
    jwtSecret: 'JWT_SECRET'
  });
};

module.exports = { protect };
