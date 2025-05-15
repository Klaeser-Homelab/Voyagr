const express = require('express');
const router = express.Router();
const { getToken } = require('../middleware/auth'); // Import the middleware
const { Value, Habit, Event, Break, Schedule } = require('../models/associations');
const { Sequelize } = require('sequelize');
const redis = require('../config/redis');

// GET all habits for the current user
router.get('/api/habits', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    // Find habits associated with the current user
    const habits = await Habit.findAll({
      where: { user_id: user_id }, // Directly filter by user_id
      include: [
        {
          model: Value,
          attributes: ['description', 'color']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new habit
router.post('/api/habits', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { description, value_id } = req.body;
    const habit = await Habit.create({
      description,
      user_id: user_id,
      value_id
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single habit by ID (with user verification)
router.get('/api/habits/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken); 
    // Find the habit associated with the current user
    const habit = await Habit.findOne({
      where: { 
        id: req.params.id,
        user_id: user_id // Directly filter by user_id
      },
      include: [
        {
          model: Value,
          attributes: ['description', 'color']
        },
        {
          model: Schedule,
          attributes: ['start_time', 'frequency_type', 'days_of_week', 'week_of_month', 'is_active']
        }
      ]
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Update habit
router.put('/api/habits', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { id, description, duration, is_active, details } = req.body; // Include all fields you want to update

    // Find the habit associated with the current user
    const habit = await Habit.findOne({
      where: {
        id: id,
        user_id: user_id // Ensure the habit belongs to the current user
      }
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found or not authorized' });
    }

    // Update the habit fields
    habit.description = description || habit.description;
    habit.duration = duration || habit.duration;
    habit.is_active = is_active !== undefined ? is_active : habit.is_active;
    habit.details = details || habit.details;
    
    // Save the updated habit
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET events for a single habit (with user verification)
router.get('/api/habits/:id/events', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    // Get the user ID from the session
    const userId = user_id;

    // Find events associated with the current user's habit
    const events = await Event.findAll({
      include: [{
        model: Habit,
        where: { 
          id: req.params.id,
          user_id: user_id // Directly filter by user_id
        },
        required: true
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 