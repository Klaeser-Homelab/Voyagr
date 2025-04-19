const express = require('express');
const requireAuth = require('../middleware/auth'); // Import the middleware
const router = express.Router();
const { Value, Habit } = require('../models/associations');
const { Sequelize, Op } = require('sequelize');

// GET all values
router.get('/api/values', requireAuth, async (req, res) => {  
  try {

    // Find values associated with the current user
    const values = await Value.findAll({
      where: { user_id: req.session.user.id }, // Directly filter by user_id
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

router.get('/api/values/no-default-breaks', requireAuth, async (req, res) => {  
  try {

    // Find values associated with the current user, excluding 'Default Break'
    const values = await Value.findAll({
      where: {
        user_id: req.session.user.id, // Directly filter by user_id
        description: {
          [Op.ne]: 'Default Break' // Exclude 'Default Break'
        }
      },
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

    const { description, color } = req.body;
    const value = await Value.create({
      user_id: req.session.user.id,
      description,
      color
    });

    res.status(201).json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update value
router.put('/api/values', requireAuth, async (req, res) => {
  console.log("PUT request received");
  try {
    const { id, description, color } = req.body;
    // Find the value associated with the current user
    const value = await Value.findOne({
      where: { 
        id: id,
        user_id: req.session.user.id // Directly filter by user_id
      }
    });
    
    if (!value) {
      return res.status(404).json({ error: 'Value not found or not authorized' });
    }

    res.json(value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE value
router.delete('/api/values/:id', requireAuth, async (req, res) => {
  try {

    // Find the value associated with the current user
    const value = await Value.findOne({
      where: { 
        id: req.params.id,
        user_id: req.session.user.id // Directly filter by user_id
      }
    });
    
    if (!value) {
      return res.status(404).json({ error: 'Value not found or not authorized' });
    }

    // Delete the value
    await value.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 