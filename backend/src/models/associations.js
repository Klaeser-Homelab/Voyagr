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

//Event Associations
Event.belongsTo(Value, { foreignKey: 'VID' });
Event.belongsTo(Input, { foreignKey: 'IID' });

Todo.addHook('beforeFind', (options) => {
  // Always include both possibilities, let Sequelize handle the association based on type
  options.include = [
    {
      model: Value,
      attributes: ['VID', 'Name', 'Color']
    },
    {
      model: Input,
      attributes: ['IID', 'Name'],
      include: [{
        model: Value,
        attributes: ['VID', 'Name', 'Color']
      }]
    }
  ];
});

module.exports = {
  Value,
  Input,
  Todo,
  Event
}; 