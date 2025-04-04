const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth'); // Import the middleware
const { Item, Value, Habit, Event, Todo } = require('../models/associations');

// GET all habits for the current user
router.get('/api/habits', requireAuth, async (req, res) => {
  try {
    const habits = await Habit.findAll({
      include: [
        {
          model: Item,
          where: { user_id: req.session.user.id },
          required: true
        },
        {
          model: Value,
          attributes: ['item_id', 'description', 'color']
        },
        {
          model: Todo,
          where: { type: 'habit' },
          required: false,
          attributes: ['item_id', 'content', 'completed']
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
    // First create the base item
    const item = await Item.create({
      user_id: req.session.user.id,
      type: 'habit'
    });

    // Then create the habit
    const { description, parent_id } = req.body;
    const habit = await Habit.create({
      item_id: item.id,
      description,
      parent_id
    });

    // Return the habit with its item data
    const fullHabit = await Habit.findByPk(habit.item_id, {
      include: [{
        model: Item,
        attributes: ['created_at']
      }]
    });

    res.status(201).json(fullHabit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single habit by ID (with user verification)
router.get('/api/habits/:id', requireAuth, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: { item_id: req.params.id },
      include: [
        {
          model: Item,
          where: { user_id: req.session.user.id },
          required: true
        },
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
router.put('/api/habits/:id', requireAuth, async (req, res) => {
  try {
    const { description, parent_id } = req.body;
    const habit = await Habit.findByPk(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await habit.update({ description, parent_id });
    
    // Return the updated habit with its item data
    const fullHabit = await Habit.findByPk(habit.item_id, {
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
    const habit = await Habit.findByPk(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Find the associated item
    const item = await Item.findByPk(habit.item_id);
    
    // Delete both the habit and its item
    await habit.destroy();
    if (item) {
      await item.destroy();
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET events for a single habit (with user verification)
router.get('/api/habits/:id/events', requireAuth, async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{
        model: Habit,
        where: { item_id: req.params.id },
        include: [{
          model: Item,
          where: { user_id: req.session.user.id },
          required: true
        }],
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