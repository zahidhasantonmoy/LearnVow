-- SQL script to check RLS policies on the content table
-- Run this in your Supabase SQL editor

-- Check if RLS is enabled on the content table
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'content';

-- Check RLS policies on the content table
SELECT * FROM pg_policy WHERE polrelid = 'content'::regclass;

-- Check if there are any RLS policies at all
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'content';

-- Try to select data as the authenticator role (this simulates what the app does)
SET ROLE authenticator;
SET request.jwt.claim.role = 'anon';

SELECT id, title, author_id, category_id, publisher_id, is_active 
FROM content 
WHERE is_active = true;

-- Reset to admin role
RESET ROLE;