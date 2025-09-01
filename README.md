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
- **Vercel Serverless Functions** - API endpoints
- **Supabase** - Database and authentication
- **Node.js** - Runtime environment

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
│   │   ├── pages/      # API routes (Vercel serverless functions)
│   │   └── api/        # API service
│   └── ...
└── ...
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Supabase account (for database and authentication)
- SSLCommerz account (for payment integration)

### Environment Variables

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

### Running the Application Locally

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Vercel Deployment

### Deploying to Vercel (Frontend + Backend)

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
   - Vercel will automatically build and deploy your frontend and backend API routes

### How It Works

This project uses Vercel's serverless functions to host both the frontend and backend:

1. **Frontend**: Next.js application served from Vercel's edge network
2. **Backend**: API routes implemented as serverless functions in `frontend/src/pages/api/`
3. **Database**: Supabase PostgreSQL database
4. **Authentication**: Supabase Auth

The API routes are automatically deployed as serverless functions alongside your frontend application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book

### Library
- `GET /api/library` - Get user's library

### Payments
- `POST /api/payment/initiate` - Initiate a payment
- `POST /api/payment/verify` - Verify a payment

### Reading Progress
- Reading progress is handled directly through Supabase client

### File Access
- `POST /api/files/generate-signed-url` - Generate a signed URL for secure file access

## Security Considerations

1. All file access is protected with signed URLs that expire after a set time
2. User authentication is handled with Supabase Auth
3. Passwords are hashed by Supabase
4. CORS is handled automatically by Vercel
5. HTTPS is enforced by Vercel

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