const express = require('express');
const router = express.Router();
const { Value, Input } = require('../models/associations');

// GET all values
router.get('/api/values', async (req, res) => {
  try {
    const values = await Value.findAll({
      include: [{
        model: Input,
        attributes: ['IID', 'Name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(values);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new value
router.post('/api/values', async (req, res) => {
  try {
    const { Name, Color } = req.body;
    const value = await Value.create({
      Name,
      Color
    });
    res.status(201).json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update value
router.put('/api/values/:id', async (req, res) => {
  try {
    const { Name, Color } = req.body;
    const value = await Value.findByPk(req.params.id);
    if (!value) {
      return res.status(404).json({ error: 'Value not found' });
    }
    await value.update({ Name, Color });
    res.json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 