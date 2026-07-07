-- ==========================================
-- HYBRID CREDIT SYSTEM SQL SETUP
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Configuration Table (Premium actions)
CREATE TABLE IF NOT EXISTS public.credit_configuration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_key TEXT NOT NULL UNIQUE,
  action_name TEXT NOT NULL,
  credit_cost INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Premium Action Configurations
INSERT INTO public.credit_configuration (action_key, action_name, credit_cost) VALUES
('generate_summary', 'Generate Summary', 2),
('generate_pdf', 'Generate PDF', 3),
('download_certificate', 'Certificate', 5),
('ai_help', 'AI Help', 1),
('gstr1_practice', 'GSTR-1 Practice', 1),
('gstr2b_practice', 'GSTR-2B Practice', 1),
('gst_assessment', 'GST Assessment', 1)
ON CONFLICT (action_key) DO NOTHING;

-- 2. Learning Sessions Table
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  module_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_pulse_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  active_duration_seconds INT DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  credits_burned INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Audit Logs Table (Immutable log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  role TEXT,
  action_type TEXT NOT NULL,
  module TEXT,
  credits_burned INT DEFAULT 0,
  credits_added INT DEFAULT 0,
  balance_after INT NOT NULL,
  device_info TEXT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Credit Bonus Tracking (Prevents duplicate awards like daily logins)
CREATE TABLE IF NOT EXISTS public.credit_bonus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  bonus_type TEXT NOT NULL,
  credits_awarded INT NOT NULL,
  award_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, bonus_type, award_date)
);

-- 5. Enable Row Level Security
ALTER TABLE public.credit_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_bonus ENABLE ROW LEVEL SECURITY;

-- 6. Basic RLS Policies
DROP POLICY IF EXISTS "Allow public read of config" ON public.credit_configuration;
CREATE POLICY "Allow public read of config" ON public.credit_configuration FOR SELECT USING (true);
CREATE POLICY "Allow service_role full config" ON public.credit_configuration TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow owner read sessions" ON public.learning_sessions;
CREATE POLICY "Allow owner read sessions" ON public.learning_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow service_role full sessions" ON public.learning_sessions TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow owner read audit" ON public.audit_logs;
CREATE POLICY "Allow owner read audit" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow service_role full audit" ON public.audit_logs TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow owner read bonus" ON public.credit_bonus;
CREATE POLICY "Allow owner read bonus" ON public.credit_bonus FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow service_role full bonus" ON public.credit_bonus TO service_role USING (true) WITH CHECK (true);
