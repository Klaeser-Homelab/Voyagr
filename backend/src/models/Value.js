const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Value = sequelize.define('Value', {
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
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  level_progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  level_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  total_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'values',
  timestamps: true,
  underscored: true
});

module.exports = Value; 