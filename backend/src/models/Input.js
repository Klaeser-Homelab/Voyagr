const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Value = require('./Value');

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

Input.belongsTo(Value, { foreignKey: 'VID' });

module.exports = Input; 