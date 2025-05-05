const express = require('express');
const router = express.Router();
const { getToken } = require('../middleware/auth'); // Import the middleware
const { Item, Value, Habit, Event, Todo } = require('../models/associations');
const { Op } = require('sequelize');

// POST new todo
router.post('/api/todos', async (req, res) => {
  try {
    const accessToken = getToken(req);  
    const user_id = await redis.get(accessToken);
    // First create the base item
    const item = await Item.create({
      user_id: user_id,
      type: 'todo'
    });

    // Parent is an event not a habit or value
    const { description, event_id } = req.body;
    
    const todo = await Todo.create({
      id: item.id,
      description,
      event_id,
      completed: false
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET completed todos for the current user
router.get('/api/todos/completed', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const todos = await Todo.findAll({
      include: [{
        model: Item,
        where: { user_id: user_id },
        required: true
      }],
      where: { completed: true }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET completed todos for today without events for the current user
router.get('/api/todos/completed/today/noevent', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const todos = await Todo.findAll({
      include: [{
        model: Item,
        where: { user_id: user_id },
        required: true
      }],
      where: { 
        completed: true, 
        updated_at: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }, 
        event_id : null 
      }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET incomplete todos for the current user
router.get('/api/todos/incomplete', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const todos = await Todo.findAll({
      include: [
        {
          model: Item,
          where: { user_id: user_id },
          required: true
        },
        {
          model: Value,
          attributes: ['id', 'description', 'color']
        },
        {
          model: Habit,
          attributes: ['id', 'description'],
          include: [{
            model: Value,
            attributes: ['id', 'description', 'color']
          }]
        }
      ],
      where: { completed: false }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/todos/batchprocess', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const todos = req.body;
    for (const todo of todos) {
      await Todo.update({ event_id: todo.event_id }, { where: { id: todo.id } });
    }
    res.status(200).json({ message: 'Todos updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET incomplete todos for a specific habit for the current user
router.get('/api/todos/incomplete/habit/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const habitId = parseInt(req.params.id);
    if (isNaN(habitId)) {
      return res.status(400).json({ error: 'Must provide a number for habit ID' });
    }

    const todos = await Todo.findAll({
      include: [{
        model: Item,
        where: { user_id: user_id },
        required: true
      }],
      where: { 
        completed: false
      }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET incomplete todos for a specific value for the current user
router.get('/api/todos/incomplete/value/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const valueId = parseInt(req.params.id);
    if (isNaN(valueId)) {
      return res.status(400).json({ error: 'Must provide a number for value ID' });
    }

    const todos = await Todo.findAll({
      include: [{
        model: Item,
        where: { user_id: user_id },
        required: true
      }],
      where: { 
        completed: false
      }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE todo completion status
router.patch('/api/todos/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const todo = await Todo.findOne({
      where: { id: req.params.id },
      include: [{
        model: Item,
        where: { user_id: user_id },
        required: true
      }]
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const { completed } = req.body;
    await todo.update({ completed });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE todo
router.delete('/api/todos/:id', async (req, res) => {
  try {
    const accessToken = getToken(req);
    const user_id = await redis.get(accessToken);
    const todo = await Todo.findOne({
      where: { id: req.params.id },
      include: [{
        model: Item,
        where: { user_id: user_id },
        required: true
      }]
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Find the associated item
    const item = await Item.findByPk(todo.id);
    
    // Delete both the todo and its item
    await todo.destroy();
    if (item) {
      await item.destroy();
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 