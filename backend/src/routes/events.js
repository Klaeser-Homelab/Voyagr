const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth'); // Import the middleware
const { Item, Value, Habit, Event, Todo } = require('../models/associations');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

// GET all events for the current user
router.get('/api/events', requireAuth, async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Item,
          where: { user_id: req.session.user.id },
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

router.get('/api/events/today', requireAuth, async (req, res) => {
  try {
    // Get today's events for the user's items
    const events = await Event.findAll({
      include: [
        {
          model: Item,
          where: { 
            user_id: req.session.user.id,
            created_at: {
              [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          required: true
        },
        {
          model: Value,
          attributes: ['color'],
          required: false
        },
        {
          model: Habit,
          attributes: [],
          include: [{
            model: Value,
            attributes: ['color']
          }],
          required: false
        }
      ]
    });

    // Get todos associated with today's events
    const eventIds = events.map(event => event.item_id);
    const todos = await Todo.findAll({
      where: {
        parent_id: eventIds
      }
    });

    // Combine events and todos
    const eventsWithTodos = events.map(event => {
      const eventData = event.toJSON();
      eventData.todos = todos.filter(todo => todo.parent_id === event.item_id);

      if(event.parent_type === 'value') {
        eventData.color = event.Value?.color;
      } else if (event.parent_type === 'habit') {
        eventData.color = event.Habit?.Value?.color;
      }

      return eventData;
    });

    res.json(eventsWithTodos);
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
      user_id: req.session.user.id,
      type: 'event'
    });

    const { parent_id, duration, parent_type } = req.body;
    
    // parent_id (Value ID) is required
    if (!parent_id) {
      return res.status(400).json({ error: 'parent_id is required' });
    }
    const event = await Event.create({
      item_id: item.id,
      parent_id: parent_id,
      duration: duration,
      parent_type: parent_type
    });

    res.status(201).json(event);
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
        where: { user_id: req.session.user.id },
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

// UPDATE event
router.put('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const { duration } = req.body;
    const event = await Event.findByPk(req.params.id);
    event.duration = duration;
    await event.save();
    res.status(200).json(event);
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
        where: { user_id: req.session.user.id },
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