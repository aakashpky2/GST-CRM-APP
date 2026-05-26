// Middleware to restrict access based on user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(`AUTH DENIED: User role '${req.user?.role}' is not in allowed roles:`, roles);
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to access this resource'
      });
    }
    next();
  };
};
