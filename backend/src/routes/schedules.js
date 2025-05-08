const express = require('express');
const router = express.Router();
const { getToken } = require('../middleware/auth'); // Import the middleware
const { Item, Value, Habit, Event, Todo, Schedule } = require('../models/associations');
const { Op } = require('sequelize');
const redis = require('../config/redis');

router.post('/api/schedules', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);

    const { habit_id, start_time, frequency_type, days_of_week, week_of_month } = req.body;

    const schedule = await Schedule.create({
        user_id,
        habit_id,
      start_time,
      frequency_type,
      days_of_week,
      week_of_month
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/schedules', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);   

    const schedules = await Schedule.findAll({
      where: { user_id }
    });

    res.status(200).json(schedules);
  } catch (error) { 
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/schedules/today', async (req, res) => {
    try {
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);
      
      // Get today's day of week (0-6, where 0 is Sunday)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
      
      // Find active schedules for the user
      const schedules = await Schedule.findAll({
        where: {
          user_id: parseInt(user_id, 10),
          is_active: true
        },
        include: [{
          model: Habit,
          attributes: ['id', 'description', 'duration', 'value_id'],
          where: {
            is_active: true
          },
          include: [{
            model: Value,
            attributes: ['id', 'description', 'color']
          }]
        }]
      });
      
      // Filter schedules that should be shown today
      const todaySchedules = schedules.filter(schedule => {
        // Daily schedules always appear
        if (schedule.frequency_type === 'daily') {
          return true;
        }
        
        // Check if this day of week is included in the schedule
        if (schedule.days_of_week && Array.isArray(schedule.days_of_week)) {
          // For weekly, check if today's day of week is in the schedule
          if (schedule.frequency_type === 'weekly' && schedule.days_of_week.includes(dayOfWeek)) {
            return true;
          }
          
          // For biweekly, check day of week and if this is the right week
          if (schedule.frequency_type === 'biweekly' && schedule.days_of_week.includes(dayOfWeek)) {
            // Determine if this is an odd or even week of the year
            const weekNumber = Math.ceil((currentDay + new Date(today.getFullYear(), today.getMonth(), 0).getDay()) / 7);
            
            // If week_of_month is null, assume every other week
            if (schedule.week_of_month === null) {
              return weekNumber % 2 === 1; // Odd weeks
            }
            
            // Otherwise check if this is the specified week of the month
            return weekNumber === schedule.week_of_month;
          }
          
          // For monthly, check if today is the specified week of the month and right day of week
          if (schedule.frequency_type === 'monthly' && schedule.days_of_week.includes(dayOfWeek)) {
            const weekOfMonth = Math.ceil((currentDay + new Date(today.getFullYear(), today.getMonth(), 0).getDay()) / 7);
            
            // Check for last week of month
            if (schedule.week_of_month === -1) {
              const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
              const lastWeekStart = daysInMonth - 6;
              return currentDay >= lastWeekStart;
            }
            
            return weekOfMonth === schedule.week_of_month;
          }
        }
        
        return false;
      });
      
      // Format the schedules for the frontend
      const formattedSchedules = todaySchedules.map(schedule => ({
        id: schedule.id,
        habit_id: schedule.habit_id,
        start_time: schedule.start_time,
        frequency_type: schedule.frequency_type,
        days_of_week: schedule.days_of_week,
        week_of_month: schedule.week_of_month,
        habit_description: schedule.Habit.description,
        habit_duration: schedule.Habit.duration,
        color: schedule.Habit.Value?.color || '#cccccc'
      }));
      
      res.json(formattedSchedules);
    } catch (error) {
      console.error('Error fetching today schedules:', error);
      res.status(500).json({ error: error.message });
    }
  });

router.put('/api/schedules/:id', async (req, res) => {
    try {
      const accessToken = getToken(req);
      const user_id = await redis.get(accessToken);   
  
      const { id } = req.params;
      const updateData = req.body; // Get all fields from request body
  
      const schedule = await Schedule.findOne({
        where: {
          id: id,
          user_id: user_id
        }
      });
  
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
  
      // Only update fields that are provided in the request body
      const allowedFields = ['start_time', 'frequency_type', 'days_of_week', 'week_of_month', 'is_active'];
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          schedule[field] = updateData[field];
        }
      }
  
      await schedule.save();
  
      res.status(200).json(schedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;