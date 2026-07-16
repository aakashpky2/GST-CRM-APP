-- Add profile fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS mobile_number TEXT,
ADD COLUMN IF NOT EXISTS institute TEXT,
ADD COLUMN IF NOT EXISTS student_id TEXT,
ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE;

-- Create student_settings table
CREATE TABLE IF NOT EXISTS public.student_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'System Default',
    language TEXT DEFAULT 'English',
    email_notifications BOOLEAN DEFAULT true,
    learning_reminders BOOLEAN DEFAULT true,
    credit_alerts BOOLEAN DEFAULT true,
    course_updates BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id)
);

-- Enable RLS
ALTER TABLE public.student_settings ENABLE ROW LEVEL SECURITY;

-- Policies for student_settings
DROP POLICY IF EXISTS "Users can view their own settings" ON public.student_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.student_settings;
DROP POLICY IF EXISTS "Service role can manage all settings" ON public.student_settings;

CREATE POLICY "Users can view their own settings" 
ON public.student_settings FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Users can update their own settings" 
ON public.student_settings FOR UPDATE 
USING (auth.uid() = student_id);

CREATE POLICY "Service role can manage all settings" 
ON public.student_settings TO service_role 
USING (true) WITH CHECK (true);
