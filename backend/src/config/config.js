// Environment variables configuration
module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/learnvow',
  sslCommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID || 'your_store_id',
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || 'your_store_password',
    apiUrl: process.env.SSLCOMMERZ_API_URL || 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
  }
};