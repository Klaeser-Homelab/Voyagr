const express = require('express');
const router = express.Router();
const { Input, Value, Event, Todo } = require('../models/associations');

// GET all inputs
router.get('/api/inputs', async (req, res) => {
  try {
    console.log('DEBUGGING INPUTS ROUTE');
    const inputs = await Input.findAll({
      include: [
        {
          model: Value,
          attributes: ['VID', 'Name', 'Color']
        },
        {
          model: Todo,
          where: { type: 'input' },
          required: false,  // LEFT JOIN so we get inputs even without todos
          attributes: ['DOID', 'content', 'completed']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(inputs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new input
router.post('/api/inputs', async (req, res) => {
  try {
    const { Name, VID } = req.body;
    const input = await Input.create({
      Name,
      VID
    });
    res.status(201).json(input);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single input by ID
router.get('/api/inputs/:id', async (req, res) => {
  try {
    const input = await Input.findByPk(req.params.id, {
      include: [{
        model: Value,
        attributes: ['Name', 'Color']
      }]
    });
    if (!input) {
      return res.status(404).json({ error: 'Input not found' });
    }
    res.json(input);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE input
router.put('/api/inputs/:id', async (req, res) => {
  try {
    const { Name, VID } = req.body;
    const input = await Input.findByPk(req.params.id);
    if (!input) {
      return res.status(404).json({ error: 'Input not found' });
    }
    await input.update({ Name, VID });
    res.json(input);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE input
router.delete('/api/inputs/:id', async (req, res) => {
  try {
    const input = await Input.findByPk(req.params.id);
    if (!input) {
      return res.status(404).json({ error: 'Input not found' });
    }
    await input.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET events for a single input
router.get('/api/inputs/:id/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { IID: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/api/inputs/:id', async (req, res) => {
  try {
    const { Name } = req.body;
    const input = await Input.findByPk(req.params.id);
    if (!input) {
      return res.status(404).json({ error: 'Input not found' });
    }
    await input.update({ Name });
    res.json(input);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  

// New route to get events by VID
router.get('/api/values/:id/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { VID: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 