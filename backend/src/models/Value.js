const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Input = require('./Input');

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

Value.hasMany(Input, { foreignKey: 'VID' });

module.exports = Value; 