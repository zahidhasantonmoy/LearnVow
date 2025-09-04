-- SQL script to enable RLS and add policies for the content table
-- Run this in your Supabase SQL editor with admin privileges

-- Enable RLS on the content table
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read active content (for the book catalog)
CREATE POLICY "Everyone can read active content" 
ON content 
FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

-- Grant necessary permissions to roles
GRANT SELECT ON content TO anon, authenticated;
GRANT ALL ON content TO authenticated;