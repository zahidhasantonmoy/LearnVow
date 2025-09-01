// Database configuration
const { Pool } = require('pg');
const config = require('./config');

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};