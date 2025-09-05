-- SQL script to remove sample books and keep only PDF books
-- Run this in your Supabase SQL editor

-- Delete the sample books (Harry Potter, 1984, Murder on the Orient Express)
DELETE FROM content WHERE title IN (
  'Harry Potter and the Philosopher''s Stone',
  '1984',
  'Murder on the Orient Express'
);

-- Optional: Delete the sample authors if they're not used by any other content
DELETE FROM authors WHERE name IN (
  'J.K. Rowling',
  'George Orwell',
  'Agatha Christie'
);

-- Optional: Delete the sample publishers if they're not used by any other content
DELETE FROM publishers WHERE name IN (
  'Penguin Random House',
  'HarperCollins',
  'Simon & Schuster'
);

-- Optional: Delete the sample categories if they're not used by any other content
-- Note: We'll keep the categories we created for the PDF books