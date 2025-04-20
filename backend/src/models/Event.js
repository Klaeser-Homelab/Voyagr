const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Event = sequelize.define('Event', {
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
  habit_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  value_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Virtual field for computed color
  color: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('color');
    }
  }

}, {
  tableName: 'events',
  timestamps: true,
  underscored: true
});

module.exports = Event; 