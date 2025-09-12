-- SQL script to update existing books with correct data
-- This will update any books that may have been inserted with incorrect data

-- Update Prompt Engineering book
UPDATE content 
SET 
  subtitle = 'TechAI Google Whitepaper',
  description = 'A comprehensive guide to prompt engineering techniques for AI models. This whitepaper explores advanced methods for crafting effective prompts that yield better results from language models.',
  content_type = 'ebook',
  file_urls = '{"full": "/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf", "sample": "/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf"}',
  sample_url = '/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf',
  author_id = (SELECT id FROM authors WHERE name = 'TechAI Google'),
  publisher_id = (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
  category_id = (SELECT id FROM categories WHERE slug = 'technology'),
  pages = 45,
  language = 'en',
  price = 12.99,
  is_active = true
WHERE title = 'Prompt Engineering';

-- Update Digital Marketing Strategy book
UPDATE content 
SET 
  subtitle = 'An Integrated Approach to Online Marketing',
  description = 'This book provides a comprehensive approach to digital marketing strategy. It covers all aspects of online marketing including SEO, social media, content marketing, and analytics to help businesses thrive in the digital landscape.',
  content_type = 'ebook',
  file_urls = '{"full": "/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf", "sample": "/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf"}',
  sample_url = '/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf',
  author_id = (SELECT id FROM authors WHERE name = 'Simon Kingsnorth'),
  publisher_id = (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
  category_id = (SELECT id FROM categories WHERE slug = 'marketing'),
  pages = 320,
  language = 'en',
  price = 14.99,
  is_active = true
WHERE title = 'Digital Marketing Strategy';

-- Update Java Notes book
UPDATE content 
SET 
  subtitle = 'Introduction to Programming',
  description = 'A comprehensive introduction to programming using Java. This textbook covers fundamental programming concepts, object-oriented programming, data structures, and algorithms for beginners.',
  content_type = 'ebook',
  file_urls = '{"full": "/content/books/javanotes5.pdf", "sample": "/content/books/javanotes5.pdf"}',
  sample_url = '/content/books/javanotes5.pdf',
  author_id = (SELECT id FROM authors WHERE name = 'David J. Eck'),
  publisher_id = (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
  category_id = (SELECT id FROM categories WHERE slug = 'education'),
  pages = 500,
  language = 'en',
  price = 9.99,
  is_active = true
WHERE title = 'Java Notes';

-- Update EDIT Tutorial book
UPDATE content 
SET 
  subtitle = 'Step-by-Step Guide',
  description = 'A practical tutorial covering essential techniques and best practices. This guide provides hands-on examples and exercises to help readers master the subject through practical application.',
  content_type = 'ebook',
  file_urls = '{"full": "/content/books/Tutorial_EDIT.pdf", "sample": "/content/books/Tutorial_EDIT.pdf"}',
  sample_url = '/content/books/Tutorial_EDIT.pdf',
  author_id = (SELECT id FROM authors WHERE name = 'Unknown Author'),
  publisher_id = (SELECT id FROM publishers WHERE name = 'LearnVow Publications'),
  category_id = (SELECT id FROM categories WHERE slug = 'tutorial'),
  pages = 30,
  language = 'en',
  price = 7.99,
  is_active = true
WHERE title = 'EDIT Tutorial';