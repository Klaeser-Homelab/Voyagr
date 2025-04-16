const { DataTypes, Sequelize } = require('sequelize');
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
  parent_habit_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  parent_value_id: {
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