-- More comprehensive debug query to check the join
-- Run this in your Supabase SQL editor

SELECT 
    c.id,
    c.title,
    a.name as author_name,
    cat.name as category_name,
    p.name as publisher_name,
    c.is_active,
    c.price,
    c.content_type
FROM content c
LEFT JOIN authors a ON c.author_id = a.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN publishers p ON c.publisher_id = p.id
WHERE c.is_active = true
ORDER BY c.id;