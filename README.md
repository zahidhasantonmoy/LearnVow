# LearnVow - Ebook & Audiobook Platform

LearnVow is a full-stack web application for an Ebook and Audiobook platform that allows users to browse, purchase, and consume digital books.

## Features

- User authentication (signup/login)
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

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication

### Payment Integration
- **SSLCommerz** - Payment gateway (Bkash, Nagad, Cards)

### Security
- **Signed URLs** - Secure file access
- **JWT Authentication** - User sessions
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
- PostgreSQL database
- SSLCommerz account (for payment integration)

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://user:password@localhost:5432/learnvow
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
BASE_URL=http://localhost:3001
```

### Database Setup

1. Create a PostgreSQL database named `learnvow`
2. Run the schema file to create tables:
   ```bash
   psql -U your_username -d learnvow -f backend/src/config/schema.sql
   ```

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

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

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
- `GET /api/progress/:bookId` - Get reading progress for a book
- `POST /api/progress/:bookId` - Update reading progress for a book

### File Access
- `POST /api/files/generate-signed-url` - Generate a signed URL for secure file access

## Deployment

### Frontend
Deploy the frontend to Vercel for optimal performance with Next.js.

### Backend
Deploy the backend to any Node.js hosting platform (e.g., Heroku, DigitalOcean App Platform).

### Database
Use a managed PostgreSQL service (e.g., Supabase, AWS RDS).

## Security Considerations

1. All file access is protected with signed URLs that expire after a set time
2. User authentication is handled with JWT tokens
3. Passwords should be hashed before storing in the database
4. CORS is configured to only allow requests from the frontend domain
5. HTTPS should be used in production

## Future Improvements

1. Implement password hashing for user authentication
2. Add email verification for new users
3. Implement password reset functionality
4. Add book reviews and ratings
5. Implement recommendations based on reading history
6. Add bookmark functionality for ebooks
7. Implement offline reading/listening capabilities
8. Add social features (reading challenges, friends, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.