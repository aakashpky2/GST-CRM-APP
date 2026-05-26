const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log('================ LOGIN API HIT ================');
  console.log('EMAIL/USERNAME RECEIVED:', email);
  console.log('PASSWORD EXISTS:', !!password);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/Username and password are required'
    });
  }

  try {
    const { data: dbUser, error } = await supabase.supabaseAdmin
      .from('users')
      .select('*')
      .or(`username.eq.${email},email.eq.${email}`)
      .maybeSingle();

    console.log('DB USER FOUND:', dbUser);
    console.log('SUPABASE ERROR:', error);

    if (error || !dbUser) {
      console.log('LOGIN FAILED: User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (dbUser.status !== 'active') {
      console.log(`LOGIN FAILED: User status is ${dbUser.status}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!dbUser.password_hash) {
      console.log('LOGIN FAILED: password_hash missing');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password_hash);

    console.log('PASSWORD MATCH:', isMatch);

    if (!isMatch) {
      console.log('LOGIN FAILED: Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    let permissions = dbUser.permissions;

    if (!permissions) {
      if (dbUser.role === 'admin' || dbUser.role === 'superadmin') {
        permissions = {
          admin_panel: true,
          learning_service: true
        };
      } else if (
        dbUser.role === 'student' ||
        dbUser.role === 'manager' ||
        dbUser.role === 'institute'
      ) {
        permissions = {
          admin_panel: false,
          learning_service: true
        };
      } else {
        permissions = {
          admin_panel: false,
          learning_service: false
        };
      }
    }

    const token = jwt.sign(
      {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email || dbUser.username,
        role: dbUser.role,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`LOGIN SUCCESS: ${dbUser.username} as ${dbUser.role}`);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email || dbUser.username,
        username: dbUser.username,
        role: dbUser.role,
        status: dbUser.status,
        permissions
      }
    });

  } catch (error) {
    console.error('UNEXPECTED LOGIN ERROR:', error);
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};