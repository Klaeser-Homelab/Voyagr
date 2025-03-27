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
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  daysOfWeek: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: null,
    validate: {
      isValidDays(value) {
        if (value && !value.every(day => day >= 0 && day <= 6)) {
          throw new Error('Days must be between 0 and 6');
        }
      }
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