const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Super Admin Login
// @route   POST /api/superadmin/login
exports.superadminLogin = async (req, res, next) => {
  const { username, password } = req.body;

  console.log('================ SUPER ADMIN LOGIN API HIT ================');
  console.log('USERNAME RECEIVED:', username);
  console.log('PASSWORD EXISTS:', !!password);

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  try {
    // 1. Find user by username using admin client to bypass RLS
    const { data: user, error } = await supabase.supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('SUPABASE DB ERROR querying user:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authentication'
      });
    }

    if (!user) {
      console.log(`SUPER ADMIN LOGIN FAILED: User '${username}' not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    console.log(`User found: '${username}' with role: '${user.role}' and status: '${user.status}'`);

    // 2. Strict validation of role and status
    if (user.role !== 'superadmin') {
      console.log(`SUPER ADMIN LOGIN FAILED: User role is '${user.role}', not 'superadmin'`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    if (user.status !== 'active') {
      console.log(`SUPER ADMIN LOGIN FAILED: Super Admin account status is '${user.status}'`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // 3. Verify password hash using bcrypt comparison
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log(`SUPER ADMIN LOGIN FAILED: Password mismatch for '${username}'`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // 4. Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is missing in .env');
      throw new Error('Server configuration error');
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('SUPER ADMIN JWT GENERATED: SUCCESS');
    console.log('================ SUPER ADMIN LOGIN API SUCCESS ================');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('SUPER ADMIN LOGIN ERROR:', error);
    next(error);
  }
};
