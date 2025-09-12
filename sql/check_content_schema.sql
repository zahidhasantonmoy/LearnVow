-- Check the exact schema of the content table
SELECT column_name, data_type, is_nullable, ordinal_position
FROM information_schema.columns 
WHERE table_name = 'content' 
ORDER BY ordinal_position;