const express = require('express');
const { getToken } = require('../middleware/auth'); // Import the middleware
const router = express.Router();
const { Value, Habit, Schedule, Break } = require('../models/associations');
const { Sequelize, Op } = require('sequelize');
const redis = require('../config/redis');
// GET all values
router.get('/api/values', async (req, res) => {  
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    
    // Find values associated with the current user
    const values = await Value.findAll({
      where: { user_id: user_id, is_active: true }, // Directly filter by user_id
      include: [{    
        model: Habit,
        required: false,
        attributes: {
          include: [
            [Sequelize.literal("'habit'"), 'type'] // Hardcode the type as 'habit'
          ]
        },
        include: [
          {
            model: Schedule, // Include schedules related to the habit
            required: false,
            where: {
              is_active: true // Only include active schedules
            },
            attributes: [
              'id', 
              'start_time', 
              'frequency_type', 
              'days_of_week', 
              'week_of_month',
              'is_active'
            ]
          },
          {
            model: Break, // Include breaks related to the habit
            required: false,
            attributes: [
              'id',
              'interval',
              'user_id'
            ]
          }
        ]
      }],
      order: [['created_at', 'DESC']],
      attributes: {
        include: [
          [Sequelize.literal("'value'"), 'type'] // Hardcode the type as 'value'
        ]
      }
    });
    
    res.json(values);
  } catch (error) {
    console.log('Error in /api/values:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/values/init', async (req, res) => {  
  try {
    const { user_id, name, color, habit_name, habit_duration, habit_frequency } = req.body;

    console.log('Request body:', req.body);
    console.log('user_id type:', typeof user_id, 'value:', user_id);
    console.log('name type:', typeof name, 'value:', name);

    // Try creating the value and log the result
    const value = await Value.create({
      user_id: user_id,
      description: name,
      color: color
    });
    
    console.log('Created value:', value.toJSON ? value.toJSON() : value);

    // Create the habit
    const habit = await Habit.create({
      user_id: user_id,
      description: habit_name,
      duration: habit_duration * 60000,
      value_id: value.id
    });
    
    console.log('Created habit:', habit.toJSON ? habit.toJSON() : habit);

    res.json({ value, habit });
  } catch (error) {
    console.log('Error in /api/values/init:', error);
    // Log more details about the error
    if (error.errors) {
      console.log('Validation errors:', error.errors);
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/values/archived', async (req, res) => {  
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    // Find values associated with the current user
    const values = await Value.findAll({
      where: { user_id: user_id, is_active: false }, // Directly filter by user_id
      include: [{    
        model: Habit,
          required: false,
          attributes: {
            include: [
              [Sequelize.literal("'habit'"), 'type'] // Hardcode the type as 'habit'
            ]
          },
          where: {
            is_active: false // Assuming 'is_active' is the field indicating active status
          }
      }],
      order: [['created_at', 'DESC']],
      attributes: {
        include: [
          [Sequelize.literal("'value'"), 'type'] // Hardcode the type as 'value'
        ]
      }
    });
    res.json(values);
  } catch (error) {
    console.log('Error in /api/values:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST new value
router.post('/api/values', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { description, color } = req.body;
    const value = await Value.create({
      user_id: user_id,
      description,
      color
    });

    res.status(201).json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update value
router.put('/api/values', async (req, res) => {
  console.log("PUT request received");
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { id, description, color, is_active } = req.body;
    // Find the value associated with the current user
    const value = await Value.findOne({
      where: { 
        id: id,
        user_id: user_id // Directly filter by user_id
      }
    });
    
    if (!value) {
      return res.status(404).json({ error: 'Value not found or not authorized' });
    }

     // Update the value fields
     value.description = description || value.description;
     value.color = color || value.color;
     value.is_active = is_active !== undefined ? is_active : value.is_active;
 
     // Save the updated value
     await value.save();

     console.log('value', value);

    res.json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/api/values', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { id } = req.body;

    console.log('id', id);

    await Value.destroy({
      where: { id, user_id: user_id }
    });

    res.json({ message: 'Value deleted successfully' });
  } catch (error) {
    console.error('Error deleting value:', error);

    if (
      error.name === 'SequelizeForeignKeyConstraintError' ||
      error.message.includes('a foreign key constraint fails')
    ) {
      console.log("error", error);
      return res.status(400).json({
        error: 'Delete failed. Please delete related habits and breaks before deleting this value.'
      });
    }

    res.status(500).json({ error: 'Failed to delete value' });
  }
});

module.exports = router; 