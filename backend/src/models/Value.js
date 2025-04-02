const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./Item');


const Value = sequelize.define('Value', {
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