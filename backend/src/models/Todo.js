const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
  DOID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['input', 'value']]
    }
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },    
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  EID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Events',
      key: 'EID'
    }
  }
}, {
  tableName: 'todo'
});

// Dynamic association based on type
Todo.addHook('beforeFind', (options) => {
  if (options.where?.type === 'input') {
    options.include = [{ model: Input }];
  } else if (options.where?.type === 'value') {
    options.include = [{ model: Value }];
  }
}); 

module.exports = Todo; 