-- Update RLS policy for individual book access
-- Run this in your Supabase SQL editor

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Everyone can read active content" ON content;

-- Create a new policy that's more explicit
CREATE POLICY "Everyone can read active content" 
ON content 
FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

-- Also grant usage on the schema if needed
GRANT USAGE ON SCHEMA public TO anon, authenticated;