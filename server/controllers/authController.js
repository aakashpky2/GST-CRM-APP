const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Login user (Unified Login System for Super Admin and other roles)
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('================ UNIFIED LOGIN API HIT ================');
  console.log('EMAIL/USERNAME RECEIVED:', email);
  console.log('PASSWORD EXISTS:', !!password);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/Username and password are required'
    });
  }

  try {
    // 1. Check if the user is in our custom 'users' database table first (e.g. Super Admin or local accounts)
    let dbUser = null;
    try {
      const { data, error } = await supabase.supabaseAdmin
        .from('users')
        .select('*')
        .eq('username', email)
        .maybeSingle();

      if (!error && data) {
        dbUser = data;
        console.log(`Custom user record found for: '${email}' with role: '${dbUser.role}'`);
      }
    } catch (dbErr) {
      console.log('Note: Error checking public.users table:', dbErr.message);
    }

    // 2. If found in public.users, authenticate using bcrypt
    if (dbUser && dbUser.password_hash && dbUser.password_hash.startsWith('$2b$')) {
      if (dbUser.status !== 'active') {
        console.log(`LOGIN FAILED: User account status is inactive ('${dbUser.status}')`);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, dbUser.password_hash);
      if (!isMatch) {
        console.log(`LOGIN FAILED: Password mismatch for custom user '${email}'`);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log(`LOGIN SUCCESS: Authenticated custom user '${email}' as role '${dbUser.role}'`);

      // Generate custom JWT
      const token = jwt.sign(
        {
          id: dbUser.id,
          username: dbUser.username,
          role: dbUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: dbUser.id,
          email: dbUser.username,
          username: dbUser.username,
          role: dbUser.role,
          status: dbUser.status,
          permissions: dbUser.permissions || { admin_panel: false, learning_service: false }
        }
      });
    }

    // 3. Fallback: Authenticate via Supabase Auth
    console.log('Custom user not found, falling back to standard Supabase authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log('SUPABASE AUTHENTICATION FAILED:', authError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('SUPABASE AUTHENTICATION SUCCESS: User ID', authData.user.id);

    // Determine the role of the user
    let role = authData.user.user_metadata?.role || authData.user.app_metadata?.role;
    
    if (!role) {
      // Check database to see if we mapped a role to this email
      try {
        const { data: dbU } = await supabase.supabaseAdmin
          .from('users')
          .select('role')
          .eq('username', email)
          .maybeSingle();
        if (dbU) {
          role = dbU.role;
        }
      } catch (err) {
        console.log('Error searching role mapping:', err.message);
      }
    }

    // Default fallback to 'student' if no role exists
    if (!role) {
      role = 'student';
    }

    console.log(`Assigned system role: '${role}' for email: '${email}'`);

    // Generate token
    const token = jwt.sign(
      {
        id: authData.user.id,
        email: authData.user.email,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Determine the permissions of the user
    let permissions = { admin_panel: false, learning_service: false };
    try {
      const { data: dbU } = await supabase.supabaseAdmin
        .from('users')
        .select('permissions')
        .eq('username', email)
        .maybeSingle();
      if (dbU && dbU.permissions) {
        permissions = dbU.permissions;
      } else {
        // Default permissions based on their role
        if (role === 'admin' || role === 'superadmin') {
          permissions = { admin_panel: true, learning_service: true };
        } else if (role === 'student' || role === 'manager' || role === 'institute') {
          permissions = { admin_panel: false, learning_service: true };
        }
      }
    } catch (err) {
      console.log('Error reading user permissions:', err.message);
    }

    console.log(`Resolved permissions: admin_panel=${permissions.admin_panel}, learning_service=${permissions.learning_service}`);
    console.log(`LOGIN SUCCESS: JWT generated successfully with role '${role}'`);
    console.log('================ LOGIN API SUCCESS ================');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: role,
        user_metadata: authData.user.user_metadata,
        permissions: permissions
      }
    });

  } catch (error) {
    console.error('UNEXPECTED ERROR IN LOGIN SYSTEM:', error);
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
