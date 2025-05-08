const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Habit = require('./Habit');
const User = require('./User');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    habit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Habit,
            key: 'id'
        }
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'The time of day when the habit should start'
    },
    frequency_type: {
        type: DataTypes.ENUM('daily', 'weekly', 'biweekly', 'monthly', 'custom'),
        allowNull: false,
        defaultValue: 'daily',
        comment: 'The type of recurrence pattern'
    },
    days_of_week: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'For weekly frequency, array of days (0-6, where 0 is Sunday). E.g., [1,3,5] for Monday, Wednesday, Friday'
    },
    week_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'For biweekly/monthly frequency, which week (1-4 or -1 for last week)'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this schedule is currently active'
    }
}, {
    tableName: 'schedules',
    timestamps: true,
    underscored: true
});

module.exports = Schedule;