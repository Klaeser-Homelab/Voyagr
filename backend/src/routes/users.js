const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const util = require('util');

// Create a JWKS client to fetch public keys from Auth0
const client = jwksRsa({
  jwksUri: `https://dev-m0q23jbgtbwidn00.us.auth0.com/.well-known/jwks.json`,  // Your Auth0 domain
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

// Promisify the key-fetching
const getSigningKey = util.promisify(client.getSigningKey);

async function verifyToken(token) {
  try {
    // Debug log the token
    console.log('Token to verify:', token.substring(0, 20) + '...');
    
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded token header:', decodedToken?.header);
    
    if (!decodedToken) {
      throw new Error('Invalid token format');
    }

    const { kid } = decodedToken.header;
    if (!kid) {
      throw new Error('Token header missing kid');
    }

    const payload = jwt.verify(token, publicKey, {
      audience: process.env.AUTH0_AUDIENCE || 'https://dev-m0q23jbgtbwidn00.us.auth0.com/api/v2/',
      issuer: `https://dev-m0q23jbgtbwidn00.us.auth0.com/`,
      algorithms: ['RS256']
    });

    console.log('Token verified successfully');
    return verified;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw error;
  }
}

// POST /api/users/auth0
// Creates or updates a user based on Auth0 data
router.post('/api/users/auth0', async (req, res) => {
  try {  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No bearer token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Received token:', token.substring(0, 20) + '...'); // Debug log

    try {
      await verifyToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        error: 'Token verification failed',
        details: error.message 
      });
    }

    // Get the user data from Auth0
    const auth0User = req.body;
    
    if (!auth0User || !auth0User.sub) {
      return res.status(400).json({ 
        error: 'Invalid Auth0 user data. Missing required fields.' 
      });
    }

    // Use the findOrCreateFromAuth0 method from the User model
    const user = await User.findOrCreateFromAuth0(auth0User);
    
    // Update last login
    await user.updateLastLogin();

    // Return user data (excluding sensitive fields)
    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      preferences: user.preferences,
      last_login: user.last_login
    };

    res.status(200).json(req.session.user);
  } catch (error) {
    console.error('Error in /api/users/auth0:', error);
    res.status(500).json({ 
      error: 'Failed to process Auth0 user data',
      details: error.message 
    });
  }
});

// GET /api/users/me
// Get current user's data
router.get('/api/users/me', async (req, res) => {
  try {
    // The user should be attached to req by the auth middleware
    if (!req.user || !req.user.auth0_id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findByAuth0Id(req.user.auth0_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data (excluding sensitive fields)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      preferences: user.preferences,
      last_login: user.last_login
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error in /api/users/me:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      details: error.message 
    });
  }
});

module.exports = router; 