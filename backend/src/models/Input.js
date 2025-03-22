const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Todo = require('./Todo');

const Input = sequelize.define('Input', {
  IID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  VID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'values',
      key: 'VID'
    }
  }
}, {
  tableName: 'inputs',
  timestamps: true
});

Input.hasMany(Todo, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: {
    type: 'input'
  }
});

module.exports = Input; 