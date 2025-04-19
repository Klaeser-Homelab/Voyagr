// Import model factories
const Value = require('./Value');
const Habit = require('./Habit');
const Event = require('./Event');
const Todo = require('./Todo');
const User = require('./User');

// Value associations
Value.hasMany(Habit, { foreignKey: 'parent_id' });
Value.belongsTo(User, { foreignKey: 'user_id' });

// Habit associations
Habit.belongsTo(Value, { foreignKey: 'parent_id' });
Habit.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(Todo, { foreignKey: 'parent_id' });
Event.belongsTo(Value, {foreignKey: 'parent_value_id',});
Event.belongsTo(Habit, {foreignKey: 'parent_habit_id',});
Event.belongsTo(User, { foreignKey: 'user_id' });
// Todo associations
Todo.belongsTo(Event, { foreignKey: 'parent_id' });
Todo.belongsTo(User, { foreignKey: 'user_id' });

// Export models
module.exports = {
  Value,
  Habit,
  Event,
  Todo
};