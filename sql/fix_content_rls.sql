-- Check current RLS policies and fix them if needed
-- Enable RLS on the content table if not already enabled
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Everyone can read active content" ON content;

-- Create a new policy that allows everyone to read active content
CREATE POLICY "Everyone can read active content" 
ON content 
FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

-- Grant necessary permissions to roles
GRANT SELECT ON content TO anon, authenticated;
GRANT ALL ON content TO authenticated;

-- Also grant usage on the schema if needed
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Check if RLS is enabled on the content table
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'content';

-- Check RLS policies on the content table
SELECT * FROM pg_policy WHERE polrelid = 'content'::regclass;