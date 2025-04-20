const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
const requireAuth = require('../middleware/auth');

// POST /api/users/auth0
// Creates or updates a user based on Auth0 data
router.post('/api/users/auth0', async (req, res) => {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No access token provided');
      return res.status(401).json({ error: 'No access token provided' });
    }

    const accessToken = authHeader.split(' ')[1];

    // Get user info from Auth0 using the access token
    const userResponse = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const auth0User = userResponse.data;

    // Find or create user in your database
    const [user, created] = await User.findOrCreate({
      where: { auth0_id: auth0User.sub },
      defaults: {
        email: auth0User.email,
        username: auth0User.nickname || auth0User.email,
        display_name: auth0User.name,
        avatar_url: auth0User.picture,
        last_login: new Date()
      }
    });

    // Update session
    req.session.user = {
      id: user.id,
      auth0Id: auth0User.sub,
      email: user.email
    };

    console.log('Session:', req.session);

    // Force session save and wait for completion
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
          return;
        }
        resolve();
      });
    });

    res.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url
      },
      isNewUser: created
    });

  } catch (error) {
    console.error('Error in /api/users/auth0:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});

// POST /api/users/logout
// Destroys the session and logs the user out
router.post('/api/users/logout', requireAuth, async (req, res) => {
  try {
    console.log('Logging out user:', req.session.user);
    
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Logout failed', details: err.message });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid');
      
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Error in /api/users/logout:', error);
    res.status(500).json({ 
      error: 'Logout failed', 
      details: error.message 
    });
  }
});

// DELETE /api/users/delete   
// Deletes the user from the database
router.delete('/api/users/delete', requireAuth, async (req, res) => {
  try {
    // Find the user associated with the current session
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user from the database
    await user.destroy(); 

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Logout failed', details: err.message });
      }

      res.json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /api/users/delete:', error);
    res.status(500).json({ 
      error: 'Failed to delete user', 
      details: error.message 
    });
  }
});


// GET /api/users/me
// Gets current user information from the session
router.get('/api/users/me', requireAuth, async (req, res) => {
  try {
    // If requireAuth middleware passed, we have a valid session
    if (!req.session.user) {
      return res.status(401).json({ error: 'No active session' });
    }
    
    // Get user data
    const user = await User.findByPk(req.session.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      avatar_url: user.avatar_url
    });
  } catch (error) {
    console.error('Error in /api/users/me:', error);
    res.status(500).json({ 
      error: 'Failed to get user information', 
      details: error.message 
    });
  }
});

module.exports = router; 