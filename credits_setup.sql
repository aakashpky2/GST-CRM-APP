-- =======================================================
-- STUDENT CREDIT SYSTEM SETUP SQL
-- Run this in your Supabase SQL Editor
-- =======================================================

-- 1. Create 'student_credits' table
CREATE TABLE IF NOT EXISTS public.student_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL UNIQUE,
  total_credits INTEGER DEFAULT 0 CHECK (total_credits >= 0),
  used_credits INTEGER DEFAULT 0 CHECK (used_credits >= 0),
  remaining_credits INTEGER DEFAULT 0 CHECK (remaining_credits >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'credit_requests' table
CREATE TABLE IF NOT EXISTS public.credit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  requested_credits INTEGER NOT NULL CHECK (requested_credits > 0),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create 'credit_transactions' table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit_added', 'credit_used', 'credit_request_approved', 'credit_request_rejected')),
  credits INTEGER NOT NULL,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.student_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow all clients to read details (the admin/service_role bypasses RLS anyway)
CREATE POLICY "Allow public select on student_credits" ON public.student_credits FOR SELECT USING (true);
CREATE POLICY "Allow public select on credit_requests" ON public.credit_requests FOR SELECT USING (true);
CREATE POLICY "Allow public select on credit_transactions" ON public.credit_transactions FOR SELECT USING (true);

-- Allow service_role full control over all credit system tables
CREATE POLICY "Allow service_role full control on student_credits" ON public.student_credits TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full control on credit_requests" ON public.credit_requests TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full control on credit_transactions" ON public.credit_transactions TO service_role USING (true) WITH CHECK (true);

-- 6. Insert default credits record trigger for custom active users with student role (if needed)
-- We'll handle matching/upserting student credits lazily in the backend APIs for complete reliability,
-- but having the tables in the database is the essential base.
