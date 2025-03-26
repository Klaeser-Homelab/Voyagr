const express = require('express');
const router = express.Router();
const { Event, Input } = require('../models');

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