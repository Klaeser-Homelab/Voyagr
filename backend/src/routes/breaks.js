const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth'); // Import the middleware
const { Value, Habit, Event, Break } = require('../models/associations');
const { Sequelize } = require('sequelize');

router.post('/api/breaks/init', async (req, res) => {
    try {
      console.log('req.body.id', req.body.id);
      // Create the "Default Break" value
      const defaultBreakValue = await Value.create({
        description: 'Default Break',
        user_id: req.body.id,
        color: '#d3d3d3' // Example color, adjust as needed
      });
  
      // Create the "Short Break" habit
      const shortBreakHabit = await Habit.create({
        description: 'Short Break',
        user_id: req.body.id,
        value_id: defaultBreakValue.id, // Associate with the "Default Break" value
        duration: 5 * 60 * 1000, // 5 minutes in milliseconds
        is_short_break: true
      });
  
      // Create the "Long Break" habit
      const longBreakHabit = await Habit.create({
        description: 'Long Break',
        user_id: req.body.id,
        value_id: defaultBreakValue.id, // Associate with the "Default Break" value
        duration: 15 * 60 * 1000, // 15 minutes in milliseconds
        is_long_break: true
      });
  
      const shortBreak = await Break.create({
        habit_id: shortBreakHabit.id,
        user_id: req.body.id,
        interval: 5 * 60 * 1000 // 5 minutes in milliseconds
      });
  
      const longBreak = await Break.create({
        habit_id: longBreakHabit.id,
        user_id: req.body.id,
        interval: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
      });
  
      console.log('Created Default Break, Short Break, and Long Break');
      res.json({ defaultBreakValue, shortBreakHabit, longBreakHabit });
    } catch (error) {
      console.error('Error creating breaks:', error);
      res.status(500).json({ error: 'Failed to create breaks' });
    }
  });

  router.get('/api/breaks', requireAuth, async (req, res) => {
    console.log('api/breaks');
    try {       
      const breaks = await Break.findAll({
        where: { user_id: req.session.user.id },
        order: [['interval', 'ASC']], // Sort by interval in ascending order
        include: [{
          model: Habit,
          attributes: ['description', 'duration', 'id', 'value_id', [Sequelize.literal("'habit'"), 'type']],
          include: [{
            model: Value,
            required: false,    
            attributes: ['description', 'color', 'id', [Sequelize.literal("'value'"), 'type']] // Include Value description and color
          }]
        }]
      });
      res.json(breaks); 
    } catch (error) {
      console.error('Error fetching breaks with habit and value data:', error);
      res.status(500).json({ error: 'Failed to fetch breaks' });
    }
  });

  router.put('/api/breaks', requireAuth, async (req, res) => {
    try {
      const { id, interval } = req.body;
  
      // Find the break for the current user
      const breakItem = await Break.findOne({
        where: {
          id,
          user_id: req.session.user.id
        }
      });
  
      if (!breakItem) {
        return res.status(404).json({ error: 'Break not found or not authorized' });
      }
  
      // Update the interval if provided
      if (interval !== undefined) {
        breakItem.interval = interval;
      }
  
      // Save changes
      await breakItem.save();
  
      res.json(breakItem);
    } catch (error) {
      console.error('Error updating break:', error);
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/api/breaks', requireAuth, async (req, res) => {
    try {
      const { habit_id, interval } = req.body;

      const newBreak = await Break.create({
        habit_id,   
        interval,
        user_id: req.session.user.id
      });

      res.json(newBreak);
    } catch (error) {
      console.error('Error adding break:', error);
      res.status(500).json({ error: 'Failed to add break' });
    }
  });

  router.delete('/api/breaks', requireAuth, async (req, res) => {
    try {
      const { id } = req.body;

      console.log('id', id);

      await Break.destroy({ where: { id, user_id: req.session.user.id } });   
      res.json({ message: 'Break deleted successfully' });
    } catch (error) {
      console.error('Error deleting break:', error);
      res.status(500).json({ error: 'Failed to delete break' });
    }
  });
  

  module.exports = router; 