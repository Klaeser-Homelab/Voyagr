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
  }
}, {
  tableName: 'values',
  timestamps: true,
  underscored: true
});

module.exports = Value; 