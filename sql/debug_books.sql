-- SQL script to check if books were inserted correctly
-- Run this in your Supabase SQL editor to debug

-- Check if authors were inserted
SELECT 'authors' as table_name, id, name FROM authors WHERE name IN ('TechAI Google', 'Simon Kingsnorth', 'David J. Eck', 'Unknown Author');

-- Check if categories were inserted
SELECT 'categories' as table_name, id, name, slug FROM categories WHERE slug IN ('technology', 'marketing', 'education', 'tutorial');

-- Check if publisher was inserted
SELECT 'publishers' as table_name, id, name FROM publishers WHERE name = 'LearnVow Publications';

-- Check if books were inserted
SELECT 'content' as table_name, id, title, author_id, category_id, publisher_id, is_active FROM content WHERE title IN ('Prompt Engineering', 'Digital Marketing Strategy', 'Java Notes', 'EDIT Tutorial');

-- Check all content to see what's actually in the table
SELECT 'all_content' as table_name, id, title, author_id, category_id, publisher_id, is_active FROM content;

-- Check if there are any authors at all
SELECT 'all_authors' as table_name, id, name FROM authors;

-- Check the structure of the content table
\d content;