const { auth } = require('express-openid-connect');
const { User } = require('../models/associations');
const express = require('express');
const router = express.Router();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Create the auth middleware
const authMiddleware = auth(config);

// Middleware to handle user creation/update
const handleAuth0User = async (req, res, next) => {
  console.log("handleAuth0User middleware");
  if (req.oidc.isAuthenticated()) {
    console.log("User is authenticated");
    try {
      const auth0User = req.oidc.user;
      
      // Find or create user
      const [user] = await User.findOrCreate({
        where: { auth0_id: auth0User.sub },
        defaults: {
          username: auth0User.nickname || auth0User.email,
          email: auth0User.email,
          display_name: auth0User.name,
          avatar_url: auth0User.picture,
          last_login: new Date(),
          metadata: {
            auth0: auth0User
          }
        }
      });

      // Update user if they exist
      if (user) {
        await user.update({
          last_login: new Date(),
          avatar_url: auth0User.picture,
          metadata: {
            ...user.metadata,
            auth0: auth0User
          }
        });
      }

      // Attach user to request
      req.user = user;
    } catch (error) {
      console.error('Error handling Auth0 user:', error);
    }
  }
  next();
};

// Test route to verify middleware
router.get('/test', (req, res) => {
  console.log('Auth Test Route - Request Details:');
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  console.log('Session:', req.session);
  console.log('OIDC:', {
    isAuthenticated: req.oidc?.isAuthenticated(),
    user: req.oidc?.user,
    claims: req.oidc?.claims
  });

  res.json({
    isAuthenticated: req.oidc?.isAuthenticated() || false,
    auth0User: req.oidc?.user || null,
    dbUser: req.user || null,
    session: req.session || null,
    cookies: req.cookies || null,
    headers: {
      authorization: req.headers.authorization,
      cookie: req.headers.cookie
    }
  });
});

module.exports = {
  config,
  authMiddleware,
  handleAuth0User,
  authRoutes: router
};