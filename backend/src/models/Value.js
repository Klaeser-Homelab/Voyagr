const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Value = sequelize.define('Value', {
  VID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Color: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'values',
  timestamps: true
});

module.exports = Value; 