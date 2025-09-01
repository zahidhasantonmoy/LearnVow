const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const libraryRoutes = require('./src/routes/libraryRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const readingProgressRoutes = require('./src/routes/readingProgressRoutes');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/progress', readingProgressRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'LearnVow API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`LearnVow backend listening at http://localhost:${PORT}`);
});