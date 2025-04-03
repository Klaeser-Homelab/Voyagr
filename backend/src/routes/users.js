const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/auth0
// Creates or updates a user based on Auth0 data
router.post('/api/users/auth0', async (req, res) => {
  try {
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