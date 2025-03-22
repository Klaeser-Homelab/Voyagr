const Input = require('./Input');
const Value = require('./Value');
const Event = require('./Event');

// Set up relationships
Input.belongsTo(Value, { foreignKey: 'VID' });
Value.hasMany(Input, { foreignKey: 'VID' });

Event.belongsTo(Input, { foreignKey: 'IID' });
Input.hasMany(Event, { foreignKey: 'IID' });

module.exports = {
  Input,
  Value,
  Event
}; 