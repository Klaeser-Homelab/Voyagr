const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Value = require('./Value');

const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  value_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Value,
      key: 'id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30 * 60 * 1000 // 30 minutes in milliseconds
  }
}, {
  tableName: 'habits',
  timestamps: true,
  underscored: true,
});

module.exports = Habit; 