# LearnVow - Modern Ebook & Audiobook Platform

LearnVow is a cutting-edge ebook and audiobook platform built with Next.js 14+ (App Router), Express.js, and Supabase. Users can browse, purchase, and enjoy ebooks or audiobooks with a futuristic reading experience.

## Features

- **Modern UI/UX Design** - Futuristic glassmorphism design with neon accents
- **User Authentication** - Secure register/login system with Supabase Auth
- **Advanced Book Browsing** - Filter by category, type, and sorting options
- **Shopping Cart** - Add/remove items, adjust quantities
- **Secure Checkout** - Multi-step checkout process with payment options
- **Personal Library** - User dashboard with reading history and progress tracking
- **Wishlist** - Save books for later purchase
- **Product Details** - Comprehensive book information with reviews
- **Responsive Design** - Works on all device sizes

## Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- CSS Modules
- Framer Motion (Animations)
- React Icons
- Supabase Auth

### Backend
- Express.js
- Supabase (Database & Auth)
- PostgreSQL

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd learnvow-website
```

### 2. Environment Variables

#### Frontend (.env.local)
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
PORT=3001
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
SSLCOMMERZ_STORE_ID=your_sslcommerz_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
```

### 3. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 4. Database Setup

1. Create a Supabase project
2. Run the SQL commands from `DATABASE_SCHEMA.md` in the Supabase SQL editor
3. Set up Supabase Auth with email provider

### 5. Run the Development Server

```bash
# Start frontend (from root directory)
npm run dev

# Start backend (from backend directory)
cd backend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
learnvow-website/
├── backend/              # Express.js backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── config/       # Configuration files
│   └── index.js          # Entry point
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API service
│   │   ├── auth/         # Authentication pages
│   │   ├── books/        # Books browsing page
│   │   ├── components/   # Shared components
│   │   ├── library/      # User library page
│   │   ├── cart/         # Shopping cart page
│   │   ├── checkout/     # Checkout process
│   │   ├── utils/        # Utility functions
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   └── pages/            # Legacy pages (API routes)
└── ...
```

## Deployment

### Vercel Deployment (Frontend)

1. Push your code to a GitHub repository
2. Create a new project on [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Backend Deployment

For the backend, you can deploy to any Node.js hosting platform like:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

Make sure to set the environment variables on your hosting platform.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

### Library
- `GET /api/library` - Get user's library

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist` - Remove item from wishlist

### Orders
- `POST /api/orders` - Create a new order

### Reading Progress
- `GET /api/progress/:bookId` - Get reading progress for a book
- `POST /api/progress/:bookId` - Update reading progress

## Modern Features Implemented

### UI/UX Enhancements
- Glassmorphism design with frosted glass effects
- Neon accent colors and glowing elements
- Smooth animations and transitions
- Responsive layout for all devices
- Modern typography with Orbitron and Exo 2 fonts

### E-Commerce Functionality
- Shopping cart with add/remove items
- Multi-step checkout process
- Order summary and payment options
- Wishlist functionality
- Product filtering and sorting

### User Experience
- Personal dashboard with reading statistics
- Reading progress tracking
- Purchase history
- Profile management
- Favorite genres tracking

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.