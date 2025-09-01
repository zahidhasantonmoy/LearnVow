# LearnVow - Ebook & Audiobook Platform

LearnVow is a full-stack web application for an Ebook and Audiobook platform that allows users to browse, purchase, and consume digital books.

## Features

- User authentication (signup/login) with Supabase Auth
- Browse books (categories, search, filters)
- Purchase books via payment gateway
- "My Library" for purchased books
- Online ebook reader (with progress tracking)
- Audiobook player (with progress tracking)
- Secure file access (signed URLs)
- Responsive design

## Tech Stack

### Frontend
- **Next.js** - React framework with SSR
- **TypeScript** - Type safety
- **CSS Modules** - Styling
- **Supabase** - Authentication and database

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - Database and authentication
- **JWT** - Authentication (fallback)

### Payment Integration
- **SSLCommerz** - Payment gateway (Bkash, Nagad, Cards)

### Security
- **Signed URLs** - Secure file access
- **Supabase Auth** - User sessions
- **CORS** - Cross-origin resource sharing protection

## Project Structure

```
learnvow/
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # Reusable components
│   │   └── api/        # API service
│   └── ...
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Middleware functions
│   │   ├── config/      # Configuration files
│   │   └── utils/       # Utility functions
│   └── ...
└── ...
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Supabase account (for database and authentication)
- SSLCommerz account (for payment integration)

### Environment Variables

#### Backend (.env in backend directory):
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
SUPABASE_URL=https://htvficmfwlkxaoxgsslc.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
BASE_URL=http://localhost:3001
```

#### Frontend (.env.local in frontend directory):
```env
NEXT_PUBLIC_SUPABASE_URL=https://htvficmfwlkxaoxgsslc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE
```

### Database Setup

The database tables have already been created in your Supabase project. Make sure you've run the SQL commands from the previous step.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:zahidhasantonmoy/LearnVow.git
   cd LearnVow
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application Locally

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Vercel Deployment

### Frontend Deployment

1. **Connect to Vercel**:
   - Go to https://vercel.com/
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project Settings**:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://htvficmfwlkxaoxgsslc.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

### Backend Deployment

For the backend, you can deploy to any Node.js hosting platform. Here are options:

#### Option 1: Render (Recommended for simplicity)

1. Go to https://render.com/
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Add Environment Variables:
   - `PORT` = `10000`
   - `JWT_SECRET` = `your-super-secret-jwt-key`
   - `SUPABASE_URL` = `https://htvficmfwlkxaoxgsslc.supabase.co`
   - `SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmZpY21md2xreGFveGdzc2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzIyMTYsImV4cCI6MjA3MjMwODIxNn0.e03QaHrUvAKdqRVoC9C5P_PhWCNVx5blVVa1YQtL2PE`
   - `SSLCOMMERZ_STORE_ID` = `your_store_id`
   - `SSLCOMMERZ_STORE_PASSWORD` = `your_store_password`
   - `SSLCOMMERZ_API_URL` = `https://sandbox.sslcommerz.com/gwprocess/v4/api.php`
   - `BASE_URL` = `https://your-render-url.onrender.com`

#### Option 2: Railway

1. Go to https://railway.app/
2. Create a new project
3. Deploy from your GitHub repository
4. Set the root directory to `backend`
5. Add the same environment variables as above

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book

### Library
- `GET /api/library` - Get user's library

### Payments
- `POST /api/payment/initiate` - Initiate a payment
- `POST /api/payment/verify` - Verify a payment

### Reading Progress
- `GET /api/progress/:bookId` - Get reading progress for a book
- `POST /api/progress/:bookId` - Update reading progress for a book

### File Access
- `POST /api/files/generate-signed-url` - Generate a signed URL for secure file access

## Security Considerations

1. All file access is protected with signed URLs that expire after a set time
2. User authentication is handled with Supabase Auth
3. Passwords are hashed by Supabase
4. CORS is configured to only allow requests from the frontend domain
5. HTTPS is enforced by Vercel and most hosting platforms

## Future Improvements

1. Implement password reset functionality
2. Add book reviews and ratings
3. Implement recommendations based on reading history
4. Add bookmark functionality for ebooks
5. Implement offline reading/listening capabilities
6. Add social features (reading challenges, friends, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.