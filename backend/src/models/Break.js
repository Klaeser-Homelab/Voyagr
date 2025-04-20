// models/Break.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Habit = require('./Habit');

const Break = sequelize.define('Break', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  habit_id: {  // Change this from 'id' to 'habit_id'
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Habit,
      key: 'id'
    }
  },
  interval: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'breaks',
  timestamps: true,
  underscored: true,
});

module.exports = Break;