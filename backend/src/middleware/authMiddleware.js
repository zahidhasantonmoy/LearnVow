// Mock authentication middleware
// In a real application, this would verify JWT tokens

const authenticate = (req, res, next) => {
  // In a real app, we would verify the JWT token from the request headers
  // For now, we'll just check if a mock token is provided
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  // In a real app, we would verify the token and decode the user info
  // For now, we'll just check if it's our mock token
  if (token.startsWith('mock-jwt-token-for-user-')) {
    // Extract user ID from token (in a real app, this would come from decoded JWT)
    const userId = token.replace('mock-jwt-token-for-user-', '');
    req.user = { id: parseInt(userId) };
    next();
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;