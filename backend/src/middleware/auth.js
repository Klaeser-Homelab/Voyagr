const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    console.log('Unauthorized: Please log in: ', req.session);
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
  next();
};

module.exports = requireAuth;