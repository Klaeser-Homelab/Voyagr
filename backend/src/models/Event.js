const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');
const Habit = require('./Habit');
const Value = require('./Value');

const Event = sequelize.define('Event', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Item,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parent_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['habit', 'value']]
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'events',
  timestamps: true,
  underscored: true,
  hooks: {
    afterFind: async (events) => {
      if (!events) return;
      
      // Handle both single instance and array of instances
      const eventArray = Array.isArray(events) ? events : [events];
      
      // Separate events by parent type
      const valueEvents = eventArray.filter(event => event.parent_type === 'value');
      const habitEvents = eventArray.filter(event => event.parent_type === 'habit');
      
      // Get colors for direct value parents
      if (valueEvents.length > 0) {
        const valueParentIds = [...new Set(valueEvents.map(event => event.parent_id))];
        const values = await Value.findAll({
          where: {
            item_id: valueParentIds
          },
          attributes: ['item_id', 'color']
        });
        const valueColorMap = new Map(values.map(value => [value.item_id, value.color]));
        
        valueEvents.forEach(event => {
          if (event && typeof event === 'object') {
            event.color = valueColorMap.get(event.parent_id) || null;
          }
        });
      }
      
      // Get colors for habit parents (requires two queries)
      if (habitEvents.length > 0) {
        // First get the habits
        const habitParentIds = [...new Set(habitEvents.map(event => event.parent_id))];
        const habits = await Habit.findAll({
          where: {
            item_id: habitParentIds
          },
          attributes: ['item_id', 'parent_id']
        });
        
        // Then get the values for those habits
        const valueParentIds = [...new Set(habits.map(habit => habit.parent_id))];
        const values = await Value.findAll({
          where: {
            item_id: valueParentIds
          },
          attributes: ['item_id', 'color']
        });
        
        // Create maps for lookups
        const valueColorMap = new Map(values.map(value => [value.item_id, value.color]));
        const habitValueMap = new Map(habits.map(habit => [habit.item_id, habit.parent_id]));
        
        habitEvents.forEach(event => {
          if (event && typeof event === 'object') {
            const valueId = habitValueMap.get(event.parent_id);
            event.color = valueColorMap.get(valueId) || null;
          }
        });
      }
    }
  }
});

module.exports = Event; 