// Import model factories
const Item = require('./Item');
const Value = require('./Value');
const Habit = require('./Habit');
const Event = require('./Event');
const Todo = require('./Todo');

// Value associations
Value.belongsTo(Item, { foreignKey: 'item_id' });
Value.hasMany(Habit, { foreignKey: 'parent_id' });

// Habit associations
Habit.belongsTo(Item, { foreignKey: 'item_id' });
Habit.belongsTo(Value, { foreignKey: 'parent_id' });

// Event associations
Event.belongsTo(Item, { foreignKey: 'item_id' });
Item.hasOne(Event, { foreignKey: 'item_id' });

Event.hasMany(Todo, { foreignKey: 'parent_id' });
Event.belongsTo(Value, {foreignKey: 'parent_value_id',});
Event.belongsTo(Habit, {foreignKey: 'parent_habit_id',});

// Todo associations
Todo.belongsTo(Item, { foreignKey: 'item_id' });
Todo.belongsTo(Event, { foreignKey: 'parent_id' });

// Item associations
Item.hasOne(Value, { foreignKey: 'item_id' });

// Export models
module.exports = {
  Item,
  Value,
  Habit,
  Event,
  Todo
};