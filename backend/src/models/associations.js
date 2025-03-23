const Value = require('./Value');
const Input = require('./Input');
const Todo = require('./Todo');
const Event = require('./Event');

// Set up associations
Value.hasMany(Input, { foreignKey: 'VID' });
Input.belongsTo(Value, { foreignKey: 'VID' });

// Todo associations
Todo.belongsTo(Input, {
  foreignKey: 'referenceId',
  constraints: false,
});

Todo.belongsTo(Value, {
  foreignKey: 'referenceId',
  constraints: false,
});

Todo.belongsTo(Event, { foreignKey: 'EID' });
Event.hasOne(Todo, { foreignKey: 'EID' });

Todo.addHook('beforeFind', (options) => {
  if (options.where?.type === 'input') {
    options.include = [{ model: Input }];
  } else if (options.where?.type === 'value') {
    options.include = [{ model: Value }];
  }
});

module.exports = {
  Value,
  Input,
  Todo,
  Event
}; 