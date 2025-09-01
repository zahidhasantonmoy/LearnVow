const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Set the session in Supabase
    const { data, error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '' // We only need the access token for verification
    });
    
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Get the user
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = authenticate;