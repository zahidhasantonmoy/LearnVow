-- SQL script to update PDF file URLs to point to the public directory
-- Run this in your Supabase SQL editor

-- Update the file_urls and sample_url for the PDF books
UPDATE content 
SET 
  file_urls = '{"full": "/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf", "sample": "/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf"}',
  sample_url = '/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf'
WHERE title = 'Prompt Engineering';

UPDATE content 
SET 
  file_urls = '{"full": "/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf", "sample": "/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf"}',
  sample_url = '/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf'
WHERE title = 'Digital Marketing Strategy';

UPDATE content 
SET 
  file_urls = '{"full": "/books/javanotes5.pdf", "sample": "/books/javanotes5.pdf"}',
  sample_url = '/books/javanotes5.pdf'
WHERE title = 'Java Notes';

UPDATE content 
SET 
  file_urls = '{"full": "/books/Tutorial_EDIT.pdf", "sample": "/books/Tutorial_EDIT.pdf"}',
  sample_url = '/books/Tutorial_EDIT.pdf'
WHERE title = 'EDIT Tutorial';