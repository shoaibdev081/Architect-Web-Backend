const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};