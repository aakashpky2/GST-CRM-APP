const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  console.log('---------------- PROTECT MIDDLEWARE HIT ----------------');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('TOKEN MISSING: Unauthorized');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // 1. Verify our custom JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('JWT VERIFICATION SUCCESS: User ID', decoded.id);

    // 2. Attach decoded user info to request
    req.user = decoded;
    
    console.log('---------------- PROTECT MIDDLEWARE DONE ----------------');
    next();
  } catch (error) {
    console.log('JWT VERIFICATION FAILED:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
