const express = require('express');
const router = express.Router();
const { Todo, Value, Input } = require('../models/associations');

router.post('/api/todos', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { description, type, referenceId } = req.body;
    
    const todo = await Todo.create({
      description,
      type,
      referenceId,
      completed: false
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: {
        completed: false  // Only get incomplete todos
      },
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
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(todos);
  } catch (error) {
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

module.exports = router; 