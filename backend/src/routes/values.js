const express = require('express');
const requireAuth = require('../middleware/auth'); // Import the middleware
const router = express.Router();
const { Item, Value, Habit, Event, Todo } = require('../models/associations');
const { Sequelize } = require('sequelize');

// GET all values
router.get('/api/values', requireAuth, async (req, res) => {
  console.log('Values session print:', req.session.user.id);
  
  try {
    const values = await Value.findAll({
      include: [{    
        model: Habit,
        attributes: {
          include: [
            [Sequelize.literal("'habit'"), 'type'] // Hardcode the type as 'habit'
          ]
        }
      }],
      order: [['created_at', 'DESC']],
      attributes: {
        include: [
          [Sequelize.literal("'value'"), 'type'] // Hardcode the type as 'value'
        ]
      }
    });
    res.json(values);
  } catch (error) {
    console.log('Error in /api/values:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST new value
router.post('/api/values', requireAuth, async (req, res) => {
  try {
    // First create the base item
    const item = await Item.create({
      user_id: req.session.user.id, // Use session user ID
      type: 'value'
    });

    // Then create the value
    const { description, color } = req.body;
    const value = await Value.create({
      item_id: item.id,
      description,
      color
    });

    // Return the value with its item data
    const fullValue = await Value.findByPk(value.item_id, {
      include: [{
        model: Item,
        attributes: ['created_at']
      }]
    });

    res.status(201).json(fullValue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update value
router.put('/api/values/:id', requireAuth, async (req, res) => {
  try {
    const { description, color } = req.body;
    const value = await Value.findByPk(req.params.id);
    
    if (!value) {
      return res.status(404).json({ error: 'Value not found' });
    }

    await value.update({ description, color });
    
    // Return the updated value with its item data
    const fullValue = await Value.findByPk(value.item_id, {
      include: [{
        model: Item,
        attributes: ['created_at']
      }]
    });

    res.json(fullValue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE value
router.delete('/api/values/:id', requireAuth, async (req, res) => {
  try {
    const value = await Value.findByPk(req.params.id);
    
    if (!value) {
      return res.status(404).json({ error: 'Value not found' });
    }

    // Find the associated item
    const item = await Item.findByPk(value.item_id);
    
    // Delete both the value and its item
    await value.destroy();
    if (item) {
      await item.destroy();
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 