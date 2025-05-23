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
    const { value_name, value_color, habit_name, habit_duration } = req.body;
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);

    const value = await Value.create({
      user_id: user_id,
      description: value_name,
      color: value_color
    });

    const habit = await Habit.create({
      user_id: user_id,
      description: habit_name,
      duration: habit_duration * 60000,
      value_id: value.id
    });

    const schedule = await Schedule.create({
      user_id: user_id,
      habit_id: habit.id,
      start_time: '18:00:00',
      frequency_type: 'daily',
      days_of_week: [1, 2, 3, 4, 5, 6, 7],
      week_of_month: 1,
      is_active: true
    });

    // Example
    const value_example = await Value.create({
      user_id: user_id,
      description: 'Diligent Learner (Identity)',
      color: '#A020F0'
    });

    await Habit.create({
      user_id: user_id,
      description: '1. Start here (Habit)',
      duration: 10 * 1000, // 10 seconds
      value_id: value_example.id
    });

    await Habit.create({
      user_id: user_id,
      description: '2. Now try this one (Habit)',
      duration: 15 * 1000, // 10 seconds
      value_id: value_example.id
    });

    const habit_break = await Habit.create({
      user_id: user_id,
      description: 'Your first break (Habit and Break)',
      duration: 5 * 1000, // 10 seconds
      value_id: value_example.id
    });

    await Break.create({
      user_id: user_id,
      interval: 12 * 1000,
      interval_rank: 1,
      habit_id: habit_break.id
    });


    // Break
    const break_example = await Value.create({
      user_id: user_id,
      description: 'Pomodoro Break',
      color: '#808080'
    });

    const habit_short_break = await Habit.create({
      user_id: user_id,
      description: 'Short Break',
      duration: 5 * 60 * 1000,
      value_id: break_example.id
    });

    const habit_long_break = await Habit.create({
      user_id: user_id,
      description: 'Long Break',
      duration: 20 * 60 * 1000,
      value_id: break_example.id
    });

    await Break.create({
      user_id: user_id,
      interval: 30 * 60 * 1000,
      interval_rank: 1,
      habit_id: habit_short_break.id
    });

    await Break.create({
      user_id: user_id,
      interval: 120 * 60 * 1000,
      interval_rank: 1,
      habit_id: habit_long_break.id
    });
    
    
    res.json({ value, habit, schedule });
  } catch (error) {
    console.log('Error in /api/values/init:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/values/init/onboardingcomplete', async (req, res) => {  
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);

    // Find values for this user
    const values = await Value.findAll({
      user_id: user_id
    });

    // Update any values with "Diligent Learner" in description to is_active: false
    let diligent_learner_id;
    for (const value of values) {
      if (value.description.includes('Diligent Learner')) {
        const diligent_learner = await Value.findByPk(value.id);
        diligent_learner_id = diligent_learner.id;
        diligent_learner.is_active = false;
        await diligent_learner.save();
      }
    }

    // Mark habits for diligent_learner_id as is_active: false
    await Habit.update({
      is_active: false
    }, {
      where: {
        value_id: diligent_learner_id
      }
    });
    
    // Default Value
    const value_example = await Value.create({
      user_id: user_id,
      description: 'Focused Worker',
      color: '#00FF00'
    });

    // Create default habit
    const habit = await Habit.create({
      user_id: user_id,
      description: 'Work',
      duration: 30 * 60 * 1000, // 30 minutes
      value_id: value_example.id
    });


    res.json({ message: 'Onboarding complete' });
  } catch (error) {
    console.log('Error in /api/values/init:', error);
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

router.post('/api/values/level/', async (req, res) => {
  try {
      const { value_id, duration } = req.body;
      
      // Validate input
      if (!value_id || !duration) {
          return res.status(400).json({ error: 'value_id and duration are required' });
      }
      
      if (duration < 0) {
          return res.status(400).json({ error: 'duration must be positive' });
      }
      
      // Find the value
      const value = await Value.findByPk(value_id);
      if (!value) {
          return res.status(404).json({ error: 'Value not found' });
      }
      
      // Calculate level progress increase (1 per 5 minutes)
      // Convert minutes to seconds for duration (assuming duration is in seconds)
      const progressIncrease = Math.floor(duration / (5 * 60 * 100)); // 5 minutes = 300000 milliseconds
      
      const oldProgress = value.level_progress;
      const oldLevel = value.level;
      // Calculate new progress and check for level ups
      let newProgress = value.level_progress + progressIncrease;
      let newLevel = value.level;
      let newLevelTime = value.level_time + duration;
      let leveledUp = false;
      //console.log('newProgress', newProgress);
      //console.log('newLevel', newLevel);
      //console.log('newLevelTime', newLevelTime);
      //console.log('leveledUp', leveledUp);
      // Handle level ups (loop back to zero plus extra)
      while (newProgress >= 100) {
          newLevel += 1;
          newProgress -= 100;
          newLevelTime = 0; // Reset level time on level up
          leveledUp = true;
      }
      
      // Update the value
      await value.update({
          level_time: newLevelTime,
          total_time: value.total_time + duration,
          level_progress: newProgress,
          level: newLevel
      });
      
      res.json({
          success: true,
          leveled_up: leveledUp,
          value: {
              id: value.id,
              description: value.description,
              color: value.color,
              level: value.level,
              level_progress: value.level_progress,
              level_time: value.level_time,
              total_time: value.total_time,
              old_progress: oldProgress,
              old_level: oldLevel
          }
      });
      
  } catch (error) {
      console.error('Error updating value level:', error);
      res.status(500).json({ error: 'Internal server error' });
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