const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('================ LOGIN API HIT ================');
  console.log('EMAIL RECEIVED:', email);
  console.log('PASSWORD EXISTS:', !!password);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    // 1. Verify with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Supabase Response Received');

    if (error) {
      console.log('SUPABASE LOGIN FAILED:', error.message);
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password'
      });
    }

    console.log('SUPABASE LOGIN SUCCESS: User ID', data.user.id);

    // 2. Generate JWT using JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is missing in .env');
      throw new Error('Server configuration error');
    }

    const token = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('JWT GENERATED: SUCCESS');
    console.log('================ LOGIN API SUCCESS ================');

    res.status(200).json({
      success: true,
      token,
      user: data.user
    });

  } catch (error) {
    console.error('SUPABASE ERROR IN BACKEND CONSOLE:', error);
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
