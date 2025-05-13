const express = require('express');
const router = express.Router();
const { getToken } = require('../middleware/auth'); // Import the middleware
const { Value, Habit, Event, Todo } = require('../models/associations');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const redis = require('../config/redis');
// GET all events for the current user
router.get('/api/events', async (req, res) => {
  try {
    const accessToken = getToken(req);  
    const user_id = await redis.get(accessToken);
    // Find events associated with the current user
    const events = await Event.findAll({
      where: { user_id: user_id }, // Directly filter by user_id
      include: [
        {
          model: Habit,
          attributes: ['id', 'description']
        },
        {
          model: Value,
          attributes: ['id', 'description', 'color']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/events/month/:monthString', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const monthString = req.params.monthString; // Format: "YYYY-MM"
    const [year, month] = monthString.split('-').map(Number);
    
    // Validate year and month
    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
    }
    
    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date
    const endDate = new Date(year, month, 0); // Last day of the month
    
    // Format dates for SQL query
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const events = await Event.findAll({
      where: {
        user_id: user_id,
        updated_at: {
          [Op.between]: [formattedStartDate, formattedEndDate]
        }
      },
      include: [
        {
          model: Habit,
          required: true, // This excludes events without habits
          attributes: ['id', 'description', 'duration', 'value_id'],
          include: [
            {
              model: Value,
              required: true, // This also excludes habits without values
              attributes: ['id', 'description', 'color']
            }
          ]
        }
      ],
      order: [
        ['updated_at', 'ASC']
      ]
    });

    // First, create a map of values
    const valueMap = new Map();
    
    events.forEach(event => {
      const habit = event.Habit;
      const value = habit.Value;
      const eventDate = new Date(event.updatedAt);
      const day = eventDate.getDate(); // Get day of month (1-31)

      // If value doesn't exist in the map yet, add it
      if (!valueMap.has(value.id)) {
        valueMap.set(value.id, {
          id: value.id,
          description: value.description,
          color: value.color,
          habits: new Map() // Map to store habits for this value
        });
      }
      
      const valueData = valueMap.get(value.id);
      
      // If habit doesn't exist in the value's habits map, add it
      if (!valueData.habits.has(habit.id)) {
        valueData.habits.set(habit.id, {
          id: habit.id,
          description: habit.description,
          duration: habit.duration,
          value_id: habit.value_id,
          days: new Set()
        });
      }
      
      // Add day to the habit's days set
      valueData.habits.get(habit.id).days.add(day);
    });

    // Convert the nested maps to arrays for response
    const result = Array.from(valueMap.values()).map(value => ({
      id: value.id,
      description: value.description,
      color: value.color,
      habits: Array.from(value.habits.values()).map(habit => ({
        id: habit.id,
        description: habit.description,
        duration: habit.duration,
        value_id: habit.value_id,
        color: value.color,
        days: Array.from(habit.days).sort((a, b) => a - b) // Convert Set to sorted array
      }))
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching month events:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/api/events/today', async (req, res) => {
  try {
    // Find today's events associated with the current user
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const events = await Event.findAll({
      where: {
        user_id: user_id, // Directly filter by user_id
        created_at: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      include: [
        {
          model: Value,
          attributes: ['description', 'color'],
          required: false
        },
        {
          model: Habit,
          attributes: ['description'],
          required: false
        }
      ],
    });

    // Get todos associated with today's events
    const eventIds = events.map(event => event.id);
    const todos = await Todo.findAll({
      where: {
        event_id: eventIds
      }
    });

    // Combine events and todos
    const eventsWithTodos = events.map(event => {
      const eventData = event.toJSON();
      eventData.todos = todos.filter(todo => todo.event_id == event.id);

      eventData.color = event.Value.color;

      if(event.habit_id == null) {
        eventData.description = event.Value.description;
      } else if (event.habit_id !== null) {
        eventData.description = event.Habit?.description;
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
router.post('/api/events', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { value_id, habit_id } = req.body;
    
    // value_id is required
    if (!value_id) {
      return res.status(400).json({ error: 'value_id is required' });
    }
    const event = await Event.create({
      user_id: user_id,
      value_id: value_id,
      habit_id: habit_id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/events/submit', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const { habit_id } = req.body;  

    const habit = await Habit.findOne({
      where: {
        id: habit_id,
        user_id: user_id
      }
    }); 

    const event = await Event.create({
      user_id: user_id,
      habit_id: habit_id,
      value_id: habit.value_id,
      duration: habit.duration
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
router.delete('/api/events/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    // Find the event associated with the current user
    const event = await Event.findOne({
      where: { 
        id: req.params.id,
        user_id: user_id // Directly filter by user_id
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or not authorized' });
    }

    // Delete the event
    await event.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE event
router.put('/api/events/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    // Find the event associated with the current user
    const event = await Event.findOne({
      where: { 
        id: req.params.id,
        user_id: user_id // Directly filter by user_id
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or not authorized' });
    }

    // Update the event
    const { duration } = req.body;
    event.duration = duration;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 