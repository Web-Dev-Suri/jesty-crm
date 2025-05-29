module.exports = function (req, res, next) {
  if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'owner')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Admins only'
  });
};