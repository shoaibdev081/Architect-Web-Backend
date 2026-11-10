module.exports = (req, res, next) => {
  // simple admin gate — expects token payload to include isAdmin:true or role:'admin'
  const user = req.user;
  if (user && (user.isAdmin || user.role === 'admin')) return next();
  return res.status(403).json({ success: false, message: 'You are not allowed to access this route' });
};