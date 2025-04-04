const requireAuth = (req, res, next) => {
  console.log('Checking auth:', req.session);
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
  next();
};

module.exports = requireAuth;