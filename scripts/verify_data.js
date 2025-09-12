// Script to verify database content and relationships
// Run with: node verify_data.js

const { supabase } = require('../src/lib/supabaseClient');

async function verifyData() {
  console.log('Verifying database content...\n');

  try {
    // 1. Check counts
    console.log('1. Checking table counts...');
    const tables = ['authors', 'categories', 'publishers', 'content'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`Error counting ${table}:`, error.message);
      } else {
        console.log(`  ${table}: ${count} records`);
      }
    }

    // 2. Check specific authors
    console.log('\n2. Checking specific authors...');
    const authorNames = ['TechAI Google', 'Simon Kingsnorth', 'David J. Eck', 'Unknown Author'];
    for (const name of authorNames) {
      const { data, error } = await supabase
        .from('authors')
        .select('id, name')
        .eq('name', name)
        .limit(1);
      
      if (error) {
        console.error(`Error checking author ${name}:`, error.message);
      } else if (data.length > 0) {
        console.log(`  Found author: ${data[0].name} (ID: ${data[0].id})`);
      } else {
        console.log(`  Author not found: ${name}`);
      }
    }

    // 3. Check specific categories
    console.log('\n3. Checking specific categories...');
    const categorySlugs = ['technology', 'marketing', 'education', 'tutorial'];
    for (const slug of categorySlugs) {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', slug)
        .limit(1);
      
      if (error) {
        console.error(`Error checking category ${slug}:`, error.message);
      } else if (data.length > 0) {
        console.log(`  Found category: ${data[0].name} (Slug: ${data[0].slug}, ID: ${data[0].id})`);
      } else {
        console.log(`  Category not found: ${slug}`);
      }
    }

    // 4. Check publisher
    console.log('\n4. Checking publisher...');
    const { data: publisherData, error: publisherError } = await supabase
      .from('publishers')
      .select('id, name')
      .eq('name', 'LearnVow Publications')
      .limit(1);
    
    if (publisherError) {
      console.error('Error checking publisher:', publisherError.message);
    } else if (publisherData.length > 0) {
      console.log(`  Found publisher: ${publisherData[0].name} (ID: ${publisherData[0].id})`);
    } else {
      console.log('  Publisher not found: LearnVow Publications');
    }

    // 5. Check specific books
    console.log('\n5. Checking specific books...');
    const bookTitles = ['Prompt Engineering', 'Digital Marketing Strategy', 'Java Notes', 'EDIT Tutorial'];
    for (const title of bookTitles) {
      const { data, error } = await supabase
        .from('content')
        .select(`
          id,
          title,
          authors(name),
          categories(name),
          publishers(name),
          content_type,
          price,
          is_active
        `)
        .eq('title', title)
        .limit(1);
      
      if (error) {
        console.error(`Error checking book ${title}:`, error.message);
      } else if (data.length > 0) {
        const book = data[0];
        console.log(`  Found book: ${book.title}`);
        console.log(`    ID: ${book.id}`);
        console.log(`    Author: ${book.authors?.name || 'Unknown'}`);
        console.log(`    Category: ${book.categories?.name || 'Unknown'}`);
        console.log(`    Publisher: ${book.publishers?.name || 'Unknown'}`);
        console.log(`    Type: ${book.content_type}`);
        console.log(`    Price: $${book.price}`);
        console.log(`    Active: ${book.is_active}`);
      } else {
        console.log(`  Book not found: ${title}`);
      }
    }

    // 6. Check all active content with relationships
    console.log('\n6. Checking all active content with relationships...');
    const { data: activeContent, error: contentError } = await supabase
      .from('content')
      .select(`
        id,
        title,
        authors(name),
        categories(name),
        publishers(name),
        content_type,
        price,
        is_active
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (contentError) {
      console.error('Error fetching active content:', contentError.message);
    } else {
      console.log(`  Found ${activeContent.length} active books:`);
      activeContent.forEach(book => {
        console.log(`    - ${book.title} by ${book.authors?.name || 'Unknown'} ($${book.price})`);
      });
    }

    console.log('\nVerification complete!');
  } catch (error) {
    console.error('Error during verification:', error.message);
  }
}

// Run the verification
verifyData();