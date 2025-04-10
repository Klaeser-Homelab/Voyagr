const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');

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
});

module.exports = Event; 