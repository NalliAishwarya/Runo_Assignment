
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Split to get token after 'Bearer'
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the whole decoded token to the request object
    next();
  } catch (err) {
    console.error('Token validation error:', err.message); // Log the specific error message
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

