const express = require('express');
const router = express.Router();
const { Value, Input, Event, Todo } = require('../models/associations');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

// Database routes
router.get('/api/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [Input]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/events/today', async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: [
        'EID',
        'duration',
        'createdAt',
        'IID',
        [Sequelize.col('Value.Color'), 'color'],
        [Sequelize.col('Value.Name'), 'valueName'],
        [Sequelize.col('Input.Name'), 'inputName']
      ],
      include: [
        {
          model: Value,
          attributes: []
        },
        {
          model: Input,
          attributes: []
        },
        {
          model: Todo,
          attributes: ['DOID', 'description', 'completed', 'updatedAt'],
          where: {
            completed: true
          },
          required: false // This makes it a LEFT JOIN so we get events even if they don't have todos
        }
      ],
      where: {
        updatedAt: {
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
router.post('/api/events', async (req, res) => {
  try {
  
    const { VID, IID, duration, type } = req.body;
    
    // VID is required
    if (!VID) {
      return res.status(400).json({ error: 'VID is required' });
    }

    const event = await Event.create({
      VID,
      IID,  // Optional now
      duration,
      type: type || 'session'
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/events/:id', async (req, res) => {
  try {
    const result = await Event.destroy({
      where: { EID: req.params.id }
    });
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 