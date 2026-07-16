const supabaseAdmin = require('../config/supabaseAdmin');

exports.getUsers = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    let query = supabaseAdmin.from('users').select('*').order('created_at', { ascending: false });

    // Hierarchy filter
    if (userRole !== 'superadmin' && userRole !== 'admin') {
      // Channel, Institute, Manager only see their direct children
      query = query.eq('parent_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    res.json({ success: true, users: data });
  } catch (err) {
    console.error('GET users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, username, role, permissions, status } = req.body;
    const creatorRole = req.user.role;
    const creatorId = req.user.id;

    // Validate hierarchy rules
    if (creatorRole === 'channel' && role !== 'institute') {
      return res.status(403).json({ success: false, message: 'Channels can only create Institutes.' });
    }
    if (creatorRole === 'institute' && role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Institutes can only create Managers.' });
    }
    if (creatorRole === 'manager' && role !== 'student') {
      return res.status(403).json({ success: false, message: 'Managers can only create Students.' });
    }
    if (creatorRole === 'student') {
      return res.status(403).json({ success: false, message: 'Students cannot create users.' });
    }

    // 1. Create User in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, role }
    });

    if (authError) throw authError;

    // 2. Insert into public.users
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        username,
        email,
        password_hash: 'supabase_auth', // Satisfy legacy NOT NULL constraint
        role,
        permissions,
        status: status || 'active',
        parent_id: (creatorRole !== 'superadmin' && creatorRole !== 'admin') ? creatorId : null
      })
      .select()
      .single();

    if (dbError) {
      // Rollback Auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw dbError;
    }

    // 3. If student, create wallet
    if (role === 'student') {
      await supabaseAdmin.from('student_credits').insert({
        student_id: authUser.user.id,
        used_credits: 0,
        remaining_credits: 0
      });
    }

    res.status(201).json({ success: true, user: dbUser });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    // 1. Fetch user to check ownership
    const { data: targetUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('parent_id')
      .eq('id', id)
      .single();

    if (fetchError || !targetUser) {
      console.error('fetchError inside deleteUser:', fetchError);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Super Admin/Admin can delete anyone. Others can only delete their children.
    if (userRole !== 'superadmin' && userRole !== 'admin') {
      if (targetUser.parent_id !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied to delete this user' });
      }
    }

    // Delete from Supabase Auth
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authDeleteError && authDeleteError.code !== 'user_not_found') {
      throw authDeleteError;
    }

    // Explicitly delete from public.users in case cascading delete didn't work or auth user was already deleted
    const { error: dbDeleteError } = await supabaseAdmin.from('users').delete().eq('id', id);
    if (dbDeleteError) {
      console.error("Error deleting from public.users:", dbDeleteError);
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, username, full_name, mobile_number, institute, student_id, joining_date, role, status')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ success: true, profile: data });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, mobile_number, institute, student_id } = req.body;
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ full_name, mobile_number, institute, student_id })
      .eq('id', req.user.id)
      .select('id, username, full_name, mobile_number, institute, student_id, joining_date, role, status')
      .single();

    if (error) throw error;
    res.json({ success: true, profile: data });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    let { data, error } = await supabaseAdmin
      .from('student_settings')
      .select('*')
      .eq('student_id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) {
      // Create default settings if not exists
      const { data: newData, error: insertError } = await supabaseAdmin
        .from('student_settings')
        .insert({ student_id: req.user.id })
        .select()
        .single();
      
      if (insertError) throw insertError;
      data = newData;
    }

    res.json({ success: true, settings: data });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    // ensure student_id is not changed
    delete updates.id;
    delete updates.student_id;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('student_settings')
      .update(updates)
      .eq('student_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, settings: data });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

exports.getLearningStatistics = async (req, res) => {
  try {
    // Fetch credits
    const { data: credits, error: creditsError } = await supabaseAdmin
      .from('student_credits')
      .select('used_credits, remaining_credits')
      .eq('student_id', req.user.id)
      .maybeSingle();

    // Fetch video watch sessions to calculate watch time and completed videos
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('video_watch_sessions')
      .select('duration_watched, completed')
      .eq('student_id', req.user.id);
      
    if (creditsError) console.error('Credits error:', creditsError);
    if (sessionsError) console.error('Sessions error:', sessionsError);

    let totalWatchTime = 0;
    let videosCompleted = 0;
    
    if (sessions) {
      sessions.forEach(s => {
        totalWatchTime += (s.duration_watched || 0);
        if (s.completed) videosCompleted++;
      });
    }

    const stats = {
      creditsRemaining: credits?.remaining_credits || 0,
      creditsUsed: credits?.used_credits || 0,
      totalWatchTime, // in seconds usually
      videosCompleted,
      coursesEnrolled: 0, // Placeholder
      currentProgress: 0, // Placeholder
      lastLogin: new Date().toISOString() // Or fetch from auth logic if stored
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error('Get learning stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch learning statistics' });
  }
};
