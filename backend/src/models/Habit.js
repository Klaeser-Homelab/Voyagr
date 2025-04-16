const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');
const Value = require('./Value');

const Habit = sequelize.define('Habit', {
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
    allowNull: false,
    references: {
      model: Value,
      key: 'item_id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30 * 60 * 1000 // 30 minutes in milliseconds
  },
  is_break: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'habits',
  timestamps: true,
  underscored: true,
  hooks: {
    afterFind: async (habits) => {
      if (!habits) return;
      
      // Handle both single instance and array of instances
      const habitArray = Array.isArray(habits) ? habits : [habits];
      
      // Get all unique parent_ids
      const parentIds = [...new Set(habitArray.map(habit => habit.parent_id))];
      
      // Fetch all relevant values in one query
      const values = await Value.findAll({
        where: {
          item_id: parentIds
        },
        attributes: ['item_id', 'color']
      });

      // Create a map for quick lookup
      const colorMap = new Map(values.map(value => [value.item_id, value.color]));

      // Append color to each habit
      habitArray.forEach(habit => {
        if (habit && typeof habit === 'object') {
          habit.color = colorMap.get(habit.parent_id) || null;
        }
      });
    }
  }
});

module.exports = Habit; 