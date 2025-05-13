const express = require('express');
const router = express.Router();
const { getToken } = require('../middleware/auth'); // Import the middleware
const { Value, Habit, Event, Break } = require('../models/associations');
const { Sequelize } = require('sequelize');
const redis = require('../config/redis');
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
        interval: 5 * 60 * 1000, // 5 minutes in milliseconds
        interval_rank: 1
      });
  
      const longBreak = await Break.create({
        habit_id: longBreakHabit.id,
        user_id: req.body.id,
        interval: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
        interval_rank: 1
      });
  
      console.log('Created Default Break, Short Break, and Long Break');
      res.json({ defaultBreakValue, shortBreakHabit, longBreakHabit });
    } catch (error) {
      console.error('Error creating breaks:', error);
      res.status(500).json({ error: 'Failed to create breaks' });
    }
  });

  router.get('/api/breaks', async (req, res) => {
    try {       
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);
      const breaks = await Break.findAll({
        where: { user_id: user_id },
        order: [
          ['interval', 'ASC'],           // First sort by interval
          ['interval_rank', 'ASC']       // Then sort by interval_rank within each interval
        ],
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

  router.put('/api/breaks', async (req, res) => {
    try {
      const { id, interval } = req.body;
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);
      // Find the break for the current user
      const breakItem = await Break.findOne({
        where: {
          id,
          user_id: user_id
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

  router.post('/api/breaks', async (req, res) => {
    try {
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);
      const { habit_id, interval } = req.body;
  
      // Find the highest interval_rank for breaks with the same interval and user
      const existingBreak = await Break.findOne({
        where: {
          user_id: user_id,
          interval: interval
        },
        order: [['interval_rank', 'DESC']]
      });
  
      // Calculate the next interval_rank
      const nextRank = existingBreak ? existingBreak.interval_rank + 1 : 1;
  
      const newBreak = await Break.create({
        habit_id,   
        interval,
        interval_rank: nextRank,
        user_id: user_id
      });
  
      res.json(newBreak);
    } catch (error) {
      console.error('Error adding break:', error);
      res.status(500).json({ error: 'Failed to add break' });
    }
  });

  router.post('/api/breaks/reorder', async (req, res) => {
    try {
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);
      const { interval, break_ids } = req.body;
  
      console.log('Reordering breaks for interval:', interval);
      console.log('Break IDs in new order:', break_ids);
  
      // Validate that all break_ids exist and belong to the user with the specified interval
      const breaks = await Break.findAll({
        where: {
          id: break_ids,
          user_id: user_id,
          interval: interval
        }
      });
  
      if (breaks.length !== break_ids.length) {
        return res.status(400).json({ 
          error: 'Some breaks not found or not authorized for this interval' 
        });
      }
  
      // Update each break's interval_rank based on its position in the array
      const updatePromises = break_ids.map(async (breakId, index) => {
        const newRank = index + 1; // Ranks start at 1
        await Break.update(
          { interval_rank: newRank },
          { 
            where: { 
              id: breakId,
              user_id: user_id 
            } 
          }
        );
        return { id: breakId, new_rank: newRank };
      });
  
      const results = await Promise.all(updatePromises);
  
      console.log('Updated ranks:', results);
      res.json({ 
        message: 'Breaks reordered successfully',
        updates: results 
      });
    } catch (error) {
      console.error('Error reordering breaks:', error);
      res.status(500).json({ error: 'Failed to reorder breaks' });
    }
  });

  router.delete('/api/breaks', async (req, res) => {
    try {
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);
      const { id } = req.body;

      console.log('id', id);

      await Break.destroy({ where: { id, user_id: user_id } });   
      res.json({ message: 'Break deleted successfully' });
    } catch (error) {
      console.error('Error deleting break:', error);
      res.status(500).json({ error: 'Failed to delete break' });
    }
  });
  

  module.exports = router; 