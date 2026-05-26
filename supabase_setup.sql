-- ==========================================
-- SUPER ADMIN SETUP SQL WITH PERMISSIONS
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the 'users' table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  permissions JSONB DEFAULT '{"admin_panel": false, "learning_service": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to read user details (or restrict as needed - the backend service role will bypass this anyway)
DROP POLICY IF EXISTS "Allow public select for validation" ON public.users;
DROP POLICY IF EXISTS "Allow service_role full control" ON public.users;

CREATE POLICY "Allow public select for validation" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow service_role full control" ON public.users TO service_role USING (true) WITH CHECK (true);

-- 4. Insert Default Super Admin User
-- Username: superadmin@123
-- Password: Superadmin@2026
-- Hash: $2b$10$7hoNfpT4Wzu0iy5oiZ8fcOtVZJY61xwcayHocy/j7sxkjH272s3vq
-- Permissions: both true
INSERT INTO public.users (username, password_hash, role, status, permissions)
VALUES (
  'superadmin@123',
  '$2b$10$7hoNfpT4Wzu0iy5oiZ8fcOtVZJY61xwcayHocy/j7sxkjH272s3vq',
  'superadmin',
  'active',
  '{"admin_panel": true, "learning_service": true}'::jsonb
) ON CONFLICT (username) DO NOTHING;
