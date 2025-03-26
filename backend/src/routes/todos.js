const express = require('express');
const router = express.Router();
const { Todo, Value, Input } = require('../models/associations');
const { Op } = require('sequelize');

router.post('/api/todos', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { description, type, referenceId, EID } = req.body;
    
    const todo = await Todo.create({
      description,
      type,
      referenceId,
      EID,
      completed: false
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/api/todos/completed', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { completed: true }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/todos/completed/today', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { completed: true, createdAt: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) } }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/todos/incomplete', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { completed: false },
      include: [
        {
          model: Value,
          attributes: ['VID', 'Name', 'Color']
        },
        {
          model: Input,
          attributes: ['IID', 'Name'],
          include: [{
            model: Value,
            attributes: ['VID', 'Name', 'Color']
          }]
        }
      ]
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/todos/incomplete/input/:IID', async (req, res) => {
  try {
    // Validate that IID is provided and is a number
    const IID = parseInt(req.params.IID);
    if (isNaN(IID)) {
      return res.status(400).json({ error: 'Must provide a number for IID' });
    }

    const todos = await Todo.findAll({
      where: { 
        completed: false,
        type: 'input',
        referenceId: IID
      }
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/api/todos/incomplete/value/:VID', async (req, res) => {
  try {
    console.log('Getting value todos');
    const VID = parseInt(req.params.VID);
    if (isNaN(VID)) {
      return res.status(400).json({ error: 'Must provide a number for VID' });
    }
    const todos = await Todo.findAll({
      where: { 
        completed: false,
        referenceId: VID,
        type: 'value'
      }
    });
    res.json(todos);
  } catch (error) {
    console.error('Error getting value todos:', error);
    res.status(500).json({ error: error.message });
  }
});



router.patch('/api/todos/:id', async (req, res) => {
  try {
    const { description, completed } = req.body;
    const updateData = {};
    
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const [updated] = await Todo.update(
      updateData,
      { where: { DOID: req.params.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/todos/:id', async (req, res) => {
  try {
    const result = await Todo.destroy({
      where: { DOID: req.params.id }
    });
    
    if (result === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle todo completed status
router.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Toggle the completed status
    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 