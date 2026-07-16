-- 1. Drop the NOT NULL constraint on password_hash since we now rely on Supabase Auth
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. If you previously created an automatic trigger to insert users into public.users, 
-- we must drop it because our backend Node.js server now handles this insertion explicitly 
-- with all the necessary roles and permissions.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Reload the schema cache to ensure PostgREST picks up the changes
NOTIFY pgrst, 'reload schema';
