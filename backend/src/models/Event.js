const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  EID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  VID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'values',
      key: 'VID'
    }
  },
  IID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'inputs',
      key: 'IID'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'session'
  }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event; 
module.exports = Event; 