const supabase = require('../config/supabase');

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
    console.log('AUTHENTICATING WITH SUPABASE AUTH...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log('SUPABASE AUTH ERROR:', authError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const { user, session } = authData;
    console.log('SUPABASE AUTH SUCCESS! User ID:', user.id);

    // Fetch user profile from public.users table using the auth user's ID
    const { data: dbUser, error: dbError } = await supabase.supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    console.log('DB PROFILE RETRIEVAL:', dbUser);
    if (dbError) {
      console.error('SUPABASE DB ERROR:', dbError.message);
    }

    if (dbError || !dbUser) {
      console.log('LOGIN BLOCKED: User profile not configured for ID:', user.id);
      return res.status(401).json({
        success: false,
        message: 'User profile is not configured. Please contact admin.'
      });
    }

    console.log("USER ROLE:", dbUser.role);
    if (dbUser.role !== 'superadmin' && dbUser.role !== 'admin' && dbUser.role !== 'student') {
      console.log('LOGIN BLOCKED: Role not allowed:', dbUser.role);
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Only Student, Admin, and Super Admin logins are permitted.'
      });
    }

    console.log("USER STATUS:", dbUser.status);
    if (dbUser.status !== 'active') {
      console.log('LOGIN BLOCKED: User account status is inactive:', dbUser.status);
      return res.status(401).json({
        success: false,
        message: 'Your account is inactive. Please contact admin.'
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

    console.log(`LOGIN SUCCESS: ${dbUser.username} as ${dbUser.role}`);

    return res.status(200).json({
      success: true,
      token: session.access_token,
      user: {
        id: dbUser.id,
        email: dbUser.username,
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