# LearnVow Deployment Guide

This guide explains how to deploy the LearnVow platform to Vercel and a Node.js hosting platform.

## Prerequisites

1. A GitHub account
2. A Vercel account
3. A Supabase account
4. A Node.js hosting platform account (Railway, Render, Heroku, etc.)

## Frontend Deployment (Vercel)

### 1. Push Code to GitHub

First, make sure your code is pushed to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
5. Click "Deploy"

### 3. Configure Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Backend Deployment

### Option 1: Railway (Recommended)

1. Go to [Railway](https://railway.app/) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set the following environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_KEY` - Your Supabase service role key
   - `PORT` - 3001 (or any port you prefer)
   - `JWT_SECRET` - A random string for JWT signing
   - `DATABASE_URL` - Your Supabase database URL
   - `SSLCOMMERZ_STORE_ID` - Your SSLCommerz store ID
   - `SSLCOMMERZ_STORE_PASSWORD` - Your SSLCommerz store password
   - `SSLCOMMERZ_API_URL` - SSLCommerz API URL
6. Set the root directory to `backend`
7. Click "Deploy"

### Option 2: Render

1. Go to [Render](https://render.com/) and sign in
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Set the following:
   - Name: learnvow-backend
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm run start
5. Add the environment variables listed above
6. Click "Create Web Service"

### Option 3: Heroku

1. Install the Heroku CLI
2. Log in to Heroku: `heroku login`
3. Create a new app: `heroku create learnvow-backend`
4. Set the root directory to `backend` in your `package.json`:
   ```json
   "scripts": {
     "start": "cd backend && node index.js"
   }
   ```
5. Set environment variables:
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_KEY=your_supabase_key
   # ... set other environment variables
   ```
6. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note your project URL and anon key

### 2. Set Up Database

1. In the Supabase dashboard, go to the SQL editor
2. Run the SQL commands from `DATABASE_SCHEMA.md`

### 3. Configure Auth

1. Go to Authentication > Settings
2. Enable Email provider
3. Configure email templates as needed

### 4. Get Service Role Key

1. Go to Settings > API
2. Copy the service role key (SUPABASE_KEY)

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### Backend (Railway/Render/Heroku)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase service role key
- `PORT` - 3001
- `JWT_SECRET` - A random string for JWT signing
- `DATABASE_URL` - Your Supabase database URL
- `SSLCOMMERZ_STORE_ID` - Your SSLCommerz store ID
- `SSLCOMMERZ_STORE_PASSWORD` - Your SSLCommerz store password
- `SSLCOMMERZ_API_URL` - SSLCommerz API URL

## Post-Deployment Steps

1. Test the frontend by visiting your Vercel deployment URL
2. Test the backend by making API requests to your backend deployment URL
3. Verify that authentication works
4. Test the shopping cart and checkout flow
5. Verify that the library and wishlist features work

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend is configured to accept requests from your frontend domain
2. **Auth Issues**: Verify that your Supabase keys are correct
3. **Database Connection**: Check that your DATABASE_URL is correct
4. **Environment Variables**: Double-check that all environment variables are set correctly

### Debugging Steps

1. Check the logs in your hosting platform's dashboard
2. Verify that all environment variables are set
3. Test API endpoints directly
4. Check browser console for frontend errors
5. Check network tab for failed requests

## Updating Your Deployment

To update your deployment after making changes:

1. Commit and push your changes to GitHub
2. For Vercel: The deployment will automatically update
3. For backend: The deployment will automatically update (Railway/Render) or you'll need to redeploy (Heroku)

This deployment guide should help you successfully deploy the LearnVow platform to production.