// Script to add PDF books to the database
import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htvficmfwlkxaoxgsslc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPDFBooks() {
  console.log('Starting to add PDF books to database...');
  
  // Sample authors (if they don't exist)
  const authors = [
    { name: 'TechAI Google', bio: 'Leading experts in AI and technology' },
    { name: 'Simon Kingsnorth', bio: 'Digital marketing expert and author' },
    { name: 'David J. Eck', bio: 'Computer science professor and educator' },
    { name: 'Unknown Author', bio: 'Technical documentation specialist' }
  ];

  console.log('Adding authors...');
  // Add authors to database
  for (const author of authors) {
    const { data, error } = await supabase
      .from('authors')
      .upsert({ name: author.name, bio: author.bio })
      .select();
    
    if (error) {
      console.error('Error adding author:', error);
    } else {
      console.log('Added/updated author:', data?.[0]);
    }
  }

  // Get author IDs
  const { data: authorData } = await supabase
    .from('authors')
    .select('id, name')
    .in('name', authors.map(a => a.name));

  const authorMap: Record<string, number> = {};
  if (authorData) {
    authorData.forEach(author => {
      authorMap[author.name] = author.id;
    });
  }

  // Sample categories (if they don't exist)
  const categories = [
    { name: 'Technology', slug: 'technology', description: 'Books about technology and innovation' },
    { name: 'Marketing', slug: 'marketing', description: 'Digital marketing and business strategy' },
    { name: 'Education', slug: 'education', description: 'Educational materials and textbooks' },
    { name: 'Tutorial', slug: 'tutorial', description: 'Step-by-step guides and tutorials' }
  ];

  console.log('Adding categories...');
  // Add categories to database
  for (const category of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({ 
        name: category.name, 
        slug: category.slug, 
        description: category.description 
      })
      .select();
    
    if (error) {
      console.error('Error adding category:', error);
    } else {
      console.log('Added/updated category:', data?.[0]);
    }
  }

  // Get category IDs
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', categories.map(c => c.slug));

  const categoryMap: Record<string, number> = {};
  if (categoryData) {
    categoryData.forEach(category => {
      categoryMap[category.slug] = category.id;
    });
  }

  // Sample publishers (if they don't exist)
  const publishers = [
    { name: 'LearnVow Publications', website: 'https://learnvow.com' }
  ];

  console.log('Adding publishers...');
  // Add publishers to database
  for (const publisher of publishers) {
    const { data, error } = await supabase
      .from('publishers')
      .upsert({ name: publisher.name, website: publisher.website })
      .select();
    
    if (error) {
      console.error('Error adding publisher:', error);
    } else {
      console.log('Added/updated publisher:', data?.[0]);
    }
  }

  // Get publisher IDs
  const { data: publisherData } = await supabase
    .from('publishers')
    .select('id, name')
    .in('name', publishers.map(p => p.name));

  const publisherMap: Record<string, number> = {};
  if (publisherData) {
    publisherData.forEach(publisher => {
      publisherMap[publisher.name] = publisher.id;
    });
  }

  // Books data
  const books = [
    {
      title: 'Prompt Engineering',
      subtitle: 'TechAI Google Whitepaper',
      description: 'A comprehensive guide to prompt engineering techniques for AI models. This whitepaper explores advanced methods for crafting effective prompts that yield better results from language models.',
      content_type: 'ebook',
      price: 12.99,
      author_id: authorMap['TechAI Google'] || 1,
      category_id: categoryMap['technology'] || 1,
      publisher_id: publisherMap['LearnVow Publications'] || 1,
      pages: 45,
      language: 'en',
      file_urls: JSON.stringify({
        full: '/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf',
        sample: '/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf'
      }),
      sample_url: '/content/books/2025-01-18-pdf-1-TechAI-Goolge-whitepaper_Prompt Engineering_v4-af36dcc7a49bb7269a58b1c9b89a8ae1.pdf'
    },
    {
      title: 'Digital Marketing Strategy',
      subtitle: 'An Integrated Approach to Online Marketing',
      description: 'This book provides a comprehensive approach to digital marketing strategy. It covers all aspects of online marketing including SEO, social media, content marketing, and analytics to help businesses thrive in the digital landscape.',
      content_type: 'ebook',
      price: 14.99,
      author_id: authorMap['Simon Kingsnorth'] || 2,
      category_id: categoryMap['marketing'] || 2,
      publisher_id: publisherMap['LearnVow Publications'] || 1,
      pages: 320,
      language: 'en',
      file_urls: JSON.stringify({
        full: '/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf',
        sample: '/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf'
      }),
      sample_url: '/content/books/Digital Marketing Strategy An Integrated Approach to Online Marketing by Simon Kingsnorth (z-lib.org).pdf'
    },
    {
      title: 'Java Notes',
      subtitle: 'Introduction to Programming',
      description: 'A comprehensive introduction to programming using Java. This textbook covers fundamental programming concepts, object-oriented programming, data structures, and algorithms for beginners.',
      content_type: 'ebook',
      price: 9.99,
      author_id: authorMap['David J. Eck'] || 3,
      category_id: categoryMap['education'] || 3,
      publisher_id: publisherMap['LearnVow Publications'] || 1,
      pages: 500,
      language: 'en',
      file_urls: JSON.stringify({
        full: '/content/books/javanotes5.pdf',
        sample: '/content/books/javanotes5.pdf'
      }),
      sample_url: '/content/books/javanotes5.pdf'
    },
    {
      title: 'EDIT Tutorial',
      subtitle: 'Step-by-Step Guide',
      description: 'A practical tutorial covering essential techniques and best practices. This guide provides hands-on examples and exercises to help readers master the subject through practical application.',
      content_type: 'ebook',
      price: 7.99,
      author_id: authorMap['Unknown Author'] || 4,
      category_id: categoryMap['tutorial'] || 4,
      publisher_id: publisherMap['LearnVow Publications'] || 1,
      pages: 30,
      language: 'en',
      file_urls: JSON.stringify({
        full: '/content/books/Tutorial_EDIT.pdf',
        sample: '/content/books/Tutorial_EDIT.pdf'
      }),
      sample_url: '/content/books/Tutorial_EDIT.pdf'
    }
  ];

  console.log('Adding books...');
  // Add books to database
  for (const book of books) {
    const { data, error } = await supabase
      .from('content')
      .upsert({
        title: book.title,
        subtitle: book.subtitle,
        description: book.description,
        content_type: book.content_type,
        price: book.price,
        author_id: book.author_id,
        category_id: book.category_id,
        publisher_id: book.publisher_id,
        pages: book.pages,
        language: book.language,
        file_urls: book.file_urls,
        sample_url: book.sample_url,
        is_active: true
      })
      .select();
    
    if (error) {
      console.error('Error adding book:', error);
    } else {
      console.log('Added/updated book:', data?.[0]);
    }
  }

  console.log('Finished adding books to database');
}

// Run the function
addPDFBooks().catch(console.error);