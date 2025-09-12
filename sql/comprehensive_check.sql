-- Comprehensive check script to verify book data and relationships
-- Run this in your Supabase SQL editor

-- 1. Check if all required data exists
SELECT 'authors' as table_name, COUNT(*) as count FROM authors;
SELECT 'categories' as table_name, COUNT(*) as count FROM categories;
SELECT 'publishers' as table_name, COUNT(*) as count FROM publishers;
SELECT 'content' as table_name, COUNT(*) as count FROM content;

-- 2. Check authors
SELECT 'authors' as table_name, id, name FROM authors WHERE name IN ('TechAI Google', 'Simon Kingsnorth', 'David J. Eck', 'Unknown Author');

-- 3. Check categories
SELECT 'categories' as table_name, id, name, slug FROM categories WHERE slug IN ('technology', 'marketing', 'education', 'tutorial');

-- 4. Check publisher
SELECT 'publishers' as table_name, id, name FROM publishers WHERE name = 'LearnVow Publications';

-- 5. Check content with all relationships
SELECT 
    c.id,
    c.title,
    a.name as author_name,
    cat.name as category_name,
    p.name as publisher_name,
    c.content_type,
    c.price,
    c.is_active,
    c.created_at
FROM content c
LEFT JOIN authors a ON c.author_id = a.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN publishers p ON c.publisher_id = p.id
WHERE c.title IN ('Prompt Engineering', 'Digital Marketing Strategy', 'Java Notes', 'EDIT Tutorial')
ORDER BY c.created_at DESC;

-- 6. Check all active content
SELECT 
    c.id,
    c.title,
    a.name as author_name,
    cat.name as category_name,
    p.name as publisher_name,
    c.content_type,
    c.price,
    c.is_active
FROM content c
LEFT JOIN authors a ON c.author_id = a.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN publishers p ON c.publisher_id = p.id
WHERE c.is_active = true
ORDER BY c.created_at DESC;

-- 7. Check for any content with missing relationships
SELECT 
    c.id,
    c.title,
    c.author_id,
    c.category_id,
    c.publisher_id,
    CASE WHEN a.id IS NULL THEN 'Missing' ELSE 'OK' END as author_status,
    CASE WHEN cat.id IS NULL THEN 'Missing' ELSE 'OK' END as category_status,
    CASE WHEN p.id IS NULL THEN 'Missing' ELSE 'OK' END as publisher_status
FROM content c
LEFT JOIN authors a ON c.author_id = a.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN publishers p ON c.publisher_id = p.id
WHERE c.is_active = true
ORDER BY c.created_at DESC;