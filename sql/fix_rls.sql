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

-- Create policy to allow admin users to read all content
CREATE POLICY "Admins can read all content" 
ON content 
FOR SELECT 
TO authenticated 
USING ( EXISTS (
  SELECT 1 FROM admin_users 
  WHERE admin_users.id = (SELECT id FROM auth.users WHERE auth.users.id = auth.uid())
) );

-- Create policy to allow admin users to insert content
CREATE POLICY "Admins can insert content" 
ON content 
FOR INSERT 
TO authenticated 
WITH CHECK ( EXISTS (
  SELECT 1 FROM admin_users 
  WHERE admin_users.id = (SELECT id FROM auth.users WHERE auth.users.id = auth.uid())
) );

-- Create policy to allow admin users to update content
CREATE POLICY "Admins can update content" 
ON content 
FOR UPDATE 
TO authenticated 
USING ( EXISTS (
  SELECT 1 FROM admin_users 
  WHERE admin_users.id = (SELECT id FROM auth.users WHERE auth.users.id = auth.uid())
) );

-- Create policy to allow admin users to delete content
CREATE POLICY "Admins can delete content" 
ON content 
FOR DELETE 
TO authenticated 
USING ( EXISTS (
  SELECT 1 FROM admin_users 
  WHERE admin_users.id = (SELECT id FROM auth.users WHERE auth.users.id = auth.uid())
) );

-- Grant necessary permissions to roles
GRANT SELECT ON content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON content TO authenticated;