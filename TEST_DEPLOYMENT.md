# LearnVow Deployment Testing Guide

This guide helps you verify that your LearnVow deployment is working correctly.

## Prerequisites

1. Your frontend deployed to Vercel
2. Your backend deployed to a Node.js hosting platform
3. Supabase project set up with the database schema

## Testing Steps

### 1. Frontend Testing

1. Visit your Vercel deployment URL
2. Verify that the homepage loads correctly
3. Check that all navigation links work
4. Test the responsive design on different screen sizes

### 2. Authentication Testing

1. Go to the login page
2. Try to login with invalid credentials - you should see an error message
3. Go to the signup page
4. Create a new account
5. Verify that you're redirected to the library page after signup
6. Logout and login with the same credentials
7. Verify that you're redirected to the library page after login

### 3. Book Browsing Testing

1. Navigate to the Books page
2. Verify that books are displayed in a grid
3. Test the filtering options (ebooks, audiobooks, categories)
4. Test the sorting options
5. Click on a book to view its details
6. Verify that the book detail page loads correctly

### 4. Shopping Cart Testing

1. While logged in, go to the Books page
2. Add a book to your cart using the "Add to Cart" button
3. Go to the Cart page
4. Verify that the book appears in your cart
5. Change the quantity of the book
6. Remove the book from the cart
7. Verify that the cart is now empty

### 5. Wishlist Testing

1. While logged in, go to the Books page
2. Add a book to your wishlist using the heart icon
3. Go to your Library page and click on the Wishlist tab
4. Verify that the book appears in your wishlist
5. Remove the book from your wishlist
6. Verify that the wishlist is now empty

### 6. Checkout Testing

1. Add a book to your cart
2. Go to the Cart page
3. Click "Proceed to Checkout"
4. Fill in the shipping information
5. Select a payment method
6. Review the order
7. Complete the order
8. Verify that you're redirected to the library page
9. Check that the purchased book appears in your library

### 7. Library Testing

1. Go to your Library page
2. Verify that purchased books appear in the "My Library" tab
3. Click on a book to start reading/listening
4. Update your reading progress
5. Verify that the progress is saved
6. Check the "Reading History" tab to see your progress

### 8. Profile Testing

1. Go to your Library page
2. Click on the "Profile" tab
3. Update your personal information
4. Change your notification preferences
5. Save your changes
6. Refresh the page and verify that your changes were saved

### 9. Backend API Testing

1. Use a tool like Postman or curl to test the backend API endpoints
2. Test the health check endpoint:
   ```bash
   curl https://your-backend-url/api/health
   ```
3. Test the books endpoint:
   ```bash
   curl https://your-backend-url/api/books
   ```
4. Test the auth endpoints:
   ```bash
   curl -X POST https://your-backend-url/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```
   ```bash
   curl -X POST https://your-backend-url/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

### 10. Performance Testing

1. Use browser developer tools to check page load times
2. Verify that images are properly optimized
3. Check that there are no JavaScript errors in the console
4. Test the application on different devices and browsers

## Common Issues and Solutions

### 1. CORS Errors

**Problem**: Frontend can't make requests to the backend
**Solution**: 
- Verify that the backend CORS configuration includes your frontend domain
- Check that the backend is running and accessible
- Verify that the API_BASE_URL in the frontend is correct

### 2. Authentication Issues

**Problem**: Users can't login or signup
**Solution**:
- Verify that Supabase Auth is properly configured
- Check that the Supabase keys are correct
- Verify that the auth routes are working correctly

### 3. Database Connection Issues

**Problem**: Data isn't loading or saving
**Solution**:
- Verify that the database schema is correctly set up
- Check that the database connection string is correct
- Verify that the necessary tables exist

### 4. Environment Variables

**Problem**: Features aren't working as expected
**Solution**:
- Double-check that all environment variables are set correctly
- Verify that sensitive keys are not exposed in client-side code
- Check that environment variables are properly loaded in both frontend and backend

## Automated Testing

For production deployments, consider setting up automated tests:

1. Unit tests for frontend components
2. Integration tests for API endpoints
3. End-to-end tests for user flows
4. Performance tests
5. Security tests

## Monitoring

Set up monitoring for your production deployment:

1. Application performance monitoring (APM)
2. Error tracking
3. Uptime monitoring
4. Database performance monitoring
5. User analytics

This testing guide should help you verify that your LearnVow deployment is working correctly and ready for production use.