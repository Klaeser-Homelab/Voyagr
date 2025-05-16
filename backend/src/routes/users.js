const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getToken } = require('../middleware/auth');
const sequelize = require('../config/database');
const { Todo, Break, Event, Habit, Value, User, Schedule } = require('../models/associations');
const redis = require('../config/redis');
// POST /api/users/auth0
// Creates or updates a user based on Auth0 data
router.post('/api/users/auth0', async (req, res) => {
  try {
    // Get the access token from the Authorization header
    const accessToken = getToken(req);

    // Get user info from Auth0 using the access token
    const userResponse = await axios.get(`https://dev-m0q23jbgtbwidn00.us.auth0.com/userinfo`, {
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
        last_login: new Date()
      }
    });

    // Update session
    redis.set(accessToken, user.id);

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
router.post('/api/users/logout', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    console.log('Logging out user:', user_id);
    
    await redis.del(accessToken);
    
    // Check if the token was deleted
    const checkToken = await redis.get(accessToken);
    if (!checkToken) {
      console.log('User session destroyed');
    }
    
    console.log('User logged out successfully');
    res.json({ message: 'User logged out successfully' });
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
router.delete('/api/users/delete', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    // Find the user associated with the current session
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Deleting user', user);

    const transaction = await sequelize.transaction();
  
    // Delete in reverse hierarchical order
    await Todo.destroy({ where: { user_id: user.id }, transaction });
    await Break.destroy({ where: { user_id: user.id }, transaction });
    await Event.destroy({ where: { user_id: user.id }, transaction });
    await Schedule.destroy({ where: { user_id: user.id }, transaction });
    await Habit.destroy({ where: { user_id: user.id }, transaction });
    await Value.destroy({ where: { user_id: user.id }, transaction });
    
    // Finally delete the user
    await User.destroy({ where: { id: user.id }, transaction });
    
    // Commit transaction
    await transaction.commit();

    console.log('User deleted successfully');


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

router.post('/api/users/store-onboarding', async (req, res) => {
  const { stateKey, identity, habit } = req.body;
  console.log('stateKey', stateKey);
  console.log('identity', identity);
  console.log('habit', habit);
  await redis.set(stateKey, JSON.stringify({ identity, habit }));
  res.json({ message: 'Onboarding data stored successfully' });
});

router.get('/api/users/get-onboarding', async (req, res) => {
  const { stateKey } = req.query;
  const onboardingData = await redis.get(stateKey);
  res.json(JSON.parse(onboardingData));
});


// GET /api/users/me
// Gets current user information from the session
router.get('/api/users/me', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    
    // Get user data
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      avatar: user.avatar,
      onboarding_completed: user.onboarding_completed,
      voyagr_avatar: user.voyagr_avatar
    });
  } catch (error) {
    console.error('Error in /api/users/me:', error);
    res.status(500).json({ 
      error: 'Failed to get user information', 
      details: error.message 
    });
  }
});

router.put('/api/users/me', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    
    // Find the user
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract fields from request body
    const { display_name, avatar, onboarding_completed, voyagr_avatar } = req.body;
    
    // Update only the fields that are provided
    if (display_name !== undefined) {
      user.display_name = display_name;
    }
    
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    
    if (onboarding_completed !== undefined) {
      user.onboarding_completed = onboarding_completed;
    }
    
    if (voyagr_avatar !== undefined) {
      user.voyagr_avatar = voyagr_avatar;
    }
    
    await user.save();
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in /api/users/me:', error);
    res.status(500).json({ 
      error: 'Failed to update user information', 
      details: error.message 
    });
  }
});

module.exports = router; 