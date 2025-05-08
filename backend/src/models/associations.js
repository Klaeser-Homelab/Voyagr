// Import model factories
const Value = require('./Value');
const Habit = require('./Habit');
const Event = require('./Event');
const Todo = require('./Todo');
const User = require('./User');
const Break = require('./Break');
const Schedule = require('./Schedule');

// Value associations
Value.hasMany(Habit, { foreignKey: 'value_id' });
Value.belongsTo(User, { foreignKey: 'user_id' });

// Habit associations
Habit.belongsTo(Value, { foreignKey: 'value_id' });
Habit.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(Todo, { foreignKey: 'event_id' });
Event.belongsTo(Value, {foreignKey: 'value_id',});
Event.belongsTo(Habit, {foreignKey: 'habit_id',});
Event.belongsTo(User, { foreignKey: 'user_id' });
// Todo associations
Todo.belongsTo(Event, { foreignKey: 'event_id' });
Todo.belongsTo(User, { foreignKey: 'user_id' });

// Break associations
Break.belongsTo(Habit, { foreignKey: 'habit_id' });
Habit.hasOne(Break, { foreignKey: 'habit_id' });
Break.belongsTo(User, { foreignKey: 'user_id' });

// Schedule associations
Schedule.belongsTo(Habit, { foreignKey: 'habit_id' });
Habit.hasMany(Schedule, { foreignKey: 'habit_id' });
Schedule.belongsTo(User, { foreignKey: 'user_id' });

// Export models
module.exports = {
  Value,
  Habit,
  Event,
  Todo,
  User,
  Break,
  Schedule
};