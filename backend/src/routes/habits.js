const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth'); // Import the middleware
const { Value, Habit, Event, Break } = require('../models/associations');
const { Sequelize } = require('sequelize');

// GET all habits for the current user
router.get('/api/habits', requireAuth, async (req, res) => {
  try {

    // Find habits associated with the current user
    const habits = await Habit.findAll({
      where: { user_id: req.session.user.id }, // Directly filter by user_id
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
router.post('/api/habits', requireAuth, async (req, res) => {
  try {
    const { description, value_id } = req.body;
    const habit = await Habit.create({
      description,
      user_id: req.session.user.id,
      value_id
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single habit by ID (with user verification)
router.get('/api/habits/:id', requireAuth, async (req, res) => {
  try {

    // Find the habit associated with the current user
    const habit = await Habit.findOne({
      where: { 
        id: req.params.id,
        user_id: req.session.user.id // Directly filter by user_id
      },
      include: [
        {
          model: Value,
          attributes: ['description', 'color']
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

// UPDATE habit
router.put('/api/habits', requireAuth, async (req, res) => {
  try {
    const { id, description, duration } = req.body;
    const habit = await Habit.findByPk(id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await habit.update({ description, duration });
    
    // Return the updated habit with its item data
    const fullHabit = await Habit.findByPk(habit.id, {
      include: [{
        model: Item,
        attributes: ['created_at']
      }]
    });

    res.json(fullHabit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE habit
router.delete('/api/habits/:id', requireAuth, async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.user.id;

    // Find the habit associated with the current user
    const habit = await Habit.findOne({
      where: { 
        id: req.params.id,
        user_id: userId // Directly filter by user_id
      }
    });
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found or not authorized' });
    }

    // Delete the habit
    await habit.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET events for a single habit (with user verification)
router.get('/api/habits/:id/events', requireAuth, async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.user.id;

    // Find events associated with the current user's habit
    const events = await Event.findAll({
      include: [{
        model: Habit,
        where: { 
          id: req.params.id,
          user_id: userId // Directly filter by user_id
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