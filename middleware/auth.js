const jwt = require('jsonwebtoken');
const { apiResponse } = require('../utils/response');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return apiResponse(res, 401,'Authentication required')
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification failed:', error.message);
    return apiResponse(res, 401, 'Invalid or expired token', { error: error.message });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user)
      return apiResponse(res, 401, 'Authentication required')

    if (!roles.includes(req.user.role))
      return apiResponse(res, 403, 'Insufficient permissions.')

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};
