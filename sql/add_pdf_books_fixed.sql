-- SQL script to add PDF books to the database
-- Fixed version with correct parameter order

-- First, let's check if our authors exist, and if not, add them
INSERT INTO authors (name, bio) 
SELECT 'TechAI Google', 'Leading experts in AI and technology'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name = 'TechAI Google');

INSERT INTO authors (name, bio) 
SELECT 'Simon Kingsnorth', 'Digital marketing expert and author'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name = 'Simon Kingsnorth');

INSERT INTO authors (name, bio) 
SELECT 'David J. Eck', 'Computer science professor and educator'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name = 'David J. Eck');

INSERT INTO authors (name, bio) 
SELECT 'Unknown Author', 'Technical documentation specialist'
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE name = 'Unknown Author');

-- Check if our categories exist, and if not, add them
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Books about technology and innovation'),
  ('Marketing', 'marketing', 'Digital marketing and business strategy'),
  ('Education', 'education', 'Educational materials and textbooks'),
  ('Tutorial', 'tutorial', 'Step-by-Step guides and tutorials')
ON CONFLICT (slug) DO NOTHING;

-- Check if our publisher exists, and if not, add it
INSERT INTO publishers (name, website) 
SELECT 'LearnVow Publications', 'https://learnvow.com'
WHERE NOT EXISTS (SELECT 1 FROM publishers WHERE name = 'LearnVow Publications');

-- Now add our PDF books
-- We'll use WHERE NOT EXISTS to avoid duplicates since there's no unique constraint on title
INSERT INTO content (title, subtitle, description, cover_url, content_type, file_urls, sample_url, author_id, publisher_id, category_id, isbn, pages, duration, language, tags, price, is_active) 
SELECT 'Prompt Engineering', 'TechAI Google Whitepaper', 'A comprehensive guide to prompt engineering techniques for AI models. This whitepaper explores advanced methods for crafting effective prompts that yield better results from language models.', NULL, 'ebook', 
   '{"full": "/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf", "sample": "/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf"}',
   '/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf', 
   (SELECT id FROM authors WHERE name = 'TechAI Google'), 
   (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
   (SELECT id FROM categories WHERE slug = 'technology'), 
   NULL, 45, NULL, 'en', NULL, 12.99, true
WHERE NOT EXISTS (SELECT 1 FROM content WHERE title = 'Prompt Engineering');

INSERT INTO content (title, subtitle, description, cover_url, content_type, file_urls, sample_url, author_id, publisher_id, category_id, isbn, pages, duration, language, tags, price, is_active) 
SELECT 'Digital Marketing Strategy', 'An Integrated Approach to Online Marketing', 'This book provides a comprehensive approach to digital marketing strategy. It covers all aspects of online marketing including SEO, social media, content marketing, and analytics to help businesses thrive in the digital landscape.', NULL, 'ebook',
   '{"full": "/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf", "sample": "/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf"}',
   '/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf', 
   (SELECT id FROM authors WHERE name = 'Simon Kingsnorth'), 
   (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
   (SELECT id FROM categories WHERE slug = 'marketing'), 
   NULL, 320, NULL, 'en', NULL, 14.99, true
WHERE NOT EXISTS (SELECT 1 FROM content WHERE title = 'Digital Marketing Strategy');

INSERT INTO content (title, subtitle, description, cover_url, content_type, file_urls, sample_url, author_id, publisher_id, category_id, isbn, pages, duration, language, tags, price, is_active) 
SELECT 'Java Notes', 'Introduction to Programming', 'A comprehensive introduction to programming using Java. This textbook covers fundamental programming concepts, object-oriented programming, data structures, and algorithms for beginners.', NULL, 'ebook',
   '{"full": "/content/books/javanotes5.pdf", "sample": "/content/books/javanotes5.pdf"}',
   '/content/books/javanotes5.pdf', 
   (SELECT id FROM authors WHERE name = 'David J. Eck'), 
   (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
   (SELECT id FROM categories WHERE slug = 'education'), 
   NULL, 500, NULL, 'en', NULL, 9.99, true
WHERE NOT EXISTS (SELECT 1 FROM content WHERE title = 'Java Notes');

INSERT INTO content (title, subtitle, description, cover_url, content_type, file_urls, sample_url, author_id, publisher_id, category_id, isbn, pages, duration, language, tags, price, is_active) 
SELECT 'EDIT Tutorial', 'Step-by-Step Guide', 'A practical tutorial covering essential techniques and best practices. This guide provides hands-on examples and exercises to help readers master the subject through practical application.', NULL, 'ebook',
   '{"full": "/content/books/Tutorial_EDIT.pdf", "sample": "/content/books/Tutorial_EDIT.pdf"}',
   '/content/books/Tutorial_EDIT.pdf', 
   (SELECT id FROM authors WHERE name = 'Unknown Author'), 
   (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
   (SELECT id FROM categories WHERE slug = 'tutorial'), 
   NULL, 30, NULL, 'en', NULL, 7.99, true
WHERE NOT EXISTS (SELECT 1 FROM content WHERE title = 'EDIT Tutorial');