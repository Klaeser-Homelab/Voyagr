const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth'); // Import the middleware
const { Item, Value, Habit, Event, Todo } = require('../models/associations');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

// GET all events for the current user
router.get('/api/events', requireAuth, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.session.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const events = await Event.findAll({
      include: [
        {
          model: Item,
          where: { user_id: req.user.id },
          required: true
        },
        {
          model: Habit,
          attributes: ['item_id', 'description']
        },
        {
          model: Value,
          attributes: ['item_id', 'description', 'color']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET today's events for the current user
router.get('/api/events/today', requireAuth, async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: [
        'item_id',
        'duration',
        'created_at',
        'parent_id',
        [Sequelize.col('Value.color'), 'color'],
        [Sequelize.col('Value.description'), 'valueDescription'],
        [Sequelize.col('Habit.description'), 'habitDescription']
      ],
      include: [
        {
          model: Item,
          where: { user_id: req.user.id },
          required: true
        },
        {
          model: Value,
          attributes: []
        },
        {
          model: Habit,
          attributes: []
        },
        {
          model: Todo,
          attributes: ['item_id', 'content', 'completed', 'updated_at'],
          where: {
            completed: true
          },
          required: false
        }
      ],
      where: {
        updated_at: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST new event
router.post('/api/events', requireAuth, async (req, res) => {
  try {
    // First create the base item
    const item = await Item.create({
      user_id: req.user.id,
      type: 'event'
    });

    const { parent_id, duration, type } = req.body;
    
    // parent_id (Value ID) is required
    if (!parent_id) {
      return res.status(400).json({ error: 'parent_id is required' });
    }

    const event = await Event.create({
      item_id: item.id,
      parent_id,
      duration,
      type: type || 'session'
    });

    // Return the event with its item data
    const fullEvent = await Event.findByPk(event.item_id, {
      include: [
        {
          model: Item,
          attributes: ['created_at']
        },
        {
          model: Value,
          attributes: ['description', 'color']
        },
        {
          model: Habit,
          attributes: ['description']
        }
      ]
    });

    res.status(201).json(fullEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
router.delete('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { item_id: req.params.id },
      include: [{
        model: Item,
        where: { user_id: req.user.id },
        required: true
      }]
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the associated item
    const item = await Item.findByPk(event.item_id);
    
    // Delete both the event and its item
    await event.destroy();
    if (item) {
      await item.destroy();
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 