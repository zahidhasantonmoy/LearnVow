# LearnVow Database Management Scripts

This directory contains SQL scripts for managing the LearnVow database.

## Scripts Overview

### 1. Data Insertion Scripts
- `add_pdf_books.sql` - Original script to add PDF books (contains errors)
- `add_pdf_books_fixed.sql` - Fixed version with correct parameter order
- `update_pdf_books.sql` - Script to update existing books with correct data

### 2. RLS (Row Level Security) Scripts
- `check_rls.sql` - Check current RLS policies
- `fix_rls.sql` - Enable RLS and set up basic policies
- `fix_content_rls.sql` - Comprehensive RLS fix for content table
- `update_rls_policy.sql` - Update existing RLS policies

### 3. Debug Scripts
- `debug_books.sql` - Check if books were inserted correctly
- `debug_join.sql` - More comprehensive debug with joins
- `debug_book_ids.sql` - Debug book IDs specifically
- `check_current_data.sql` - Check current data in content table
- `check_content_schema.sql` - Check the exact schema of content table
- `comprehensive_check.sql` - Comprehensive check of all data and relationships

### 4. Maintenance Scripts
- `remove_sample_books.sql` - Remove sample books from database

## Usage Instructions

1. **To add PDF books to the database:**
   Run `add_pdf_books_fixed.sql` in your Supabase SQL editor

2. **To fix RLS policies:**
   Run `fix_content_rls.sql` in your Supabase SQL editor

3. **To update existing books with correct data:**
   Run `update_pdf_books.sql` in your Supabase SQL editor

4. **To check if data was inserted correctly:**
   Run `comprehensive_check.sql` in your Supabase SQL editor

## Troubleshooting

If books are not showing up in the frontend:

1. Run `comprehensive_check.sql` to verify data exists
2. Check RLS policies with `check_rls.sql`
3. Fix RLS with `fix_content_rls.sql` if needed
4. Update data with `update_pdf_books.sql` if needed

## Common Issues

1. **Books not showing up:** Usually caused by incorrect RLS policies or missing data
2. **Author/category/publisher not showing:** Caused by incorrect foreign key relationships
3. **Permission denied errors:** Caused by incorrect RLS policies

When in doubt, run the comprehensive check script to diagnose issues.