'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename columns in values table
    await queryInterface.renameColumn('values', 'VID', 'vid');
    await queryInterface.renameColumn('values', 'Name', 'name');
    await queryInterface.renameColumn('values', 'Description', 'description');
    await queryInterface.renameColumn('values', 'createdAt', 'created_at');
    await queryInterface.renameColumn('values', 'updatedAt', 'updated_at');

    // Rename columns in inputs table
    await queryInterface.renameColumn('inputs', 'IID', 'iid');
    await queryInterface.renameColumn('inputs', 'Name', 'name');
    await queryInterface.renameColumn('inputs', 'VID', 'vid');
    await queryInterface.renameColumn('inputs', 'startTime', 'start_time');
    await queryInterface.renameColumn('inputs', 'endTime', 'end_time');
    await queryInterface.renameColumn('inputs', 'daysOfWeek', 'days_of_week');
    await queryInterface.renameColumn('inputs', 'createdAt', 'created_at');
    await queryInterface.renameColumn('inputs', 'updatedAt', 'updated_at');

    // Rename columns in todos table
    await queryInterface.renameColumn('todos', 'DOID', 'tid');
    await queryInterface.renameColumn('todos', 'type', 'type');
    await queryInterface.renameColumn('todos', 'referenceId', 'reference_id');
    await queryInterface.renameColumn('todos', 'description', 'description');
    await queryInterface.renameColumn('todos', 'completed', 'completed');
    await queryInterface.renameColumn('todos', 'EID', 'eid');
    await queryInterface.renameColumn('todos', 'createdAt', 'created_at');
    await queryInterface.renameColumn('todos', 'updatedAt', 'updated_at');

    // Rename columns in events table
    await queryInterface.renameColumn('events', 'EID', 'eid');
    await queryInterface.renameColumn('events', 'VID', 'vid');
    await queryInterface.renameColumn('events', 'IID', 'iid');
    await queryInterface.renameColumn('events', 'duration', 'duration');
    await queryInterface.renameColumn('events', 'type', 'type');
    await queryInterface.renameColumn('events', 'createdAt', 'created_at');
    await queryInterface.renameColumn('events', 'updatedAt', 'updated_at');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes in values table
    await queryInterface.renameColumn('values', 'vid', 'VID');
    await queryInterface.renameColumn('values', 'name', 'Name');
    await queryInterface.renameColumn('values', 'description', 'Description');
    await queryInterface.renameColumn('values', 'created_at', 'createdAt');
    await queryInterface.renameColumn('values', 'updated_at', 'updatedAt');

    // Revert changes in inputs table
    await queryInterface.renameColumn('inputs', 'iid', 'IID');
    await queryInterface.renameColumn('inputs', 'name', 'Name');
    await queryInterface.renameColumn('inputs', 'vid', 'VID');
    await queryInterface.renameColumn('inputs', 'start_time', 'startTime');
    await queryInterface.renameColumn('inputs', 'end_time', 'endTime');
    await queryInterface.renameColumn('inputs', 'days_of_week', 'daysOfWeek');
    await queryInterface.renameColumn('inputs', 'created_at', 'createdAt');
    await queryInterface.renameColumn('inputs', 'updated_at', 'updatedAt');

    // Revert changes in todos table
    await queryInterface.renameColumn('todos', 'doid', 'DOID');
    await queryInterface.renameColumn('todos', 'type', 'type');
    await queryInterface.renameColumn('todos', 'reference_id', 'referenceId');
    await queryInterface.renameColumn('todos', 'description', 'description');
    await queryInterface.renameColumn('todos', 'completed', 'completed');
    await queryInterface.renameColumn('todos', 'eid', 'EID');
    await queryInterface.renameColumn('todos', 'created_at', 'createdAt');
    await queryInterface.renameColumn('todos', 'updated_at', 'updatedAt');

    // Revert changes in events table
    await queryInterface.renameColumn('events', 'eid', 'EID');
    await queryInterface.renameColumn('events', 'vid', 'VID');
    await queryInterface.renameColumn('events', 'iid', 'IID');
    await queryInterface.renameColumn('events', 'duration', 'duration');
    await queryInterface.renameColumn('events', 'type', 'type');
    await queryInterface.renameColumn('events', 'created_at', 'createdAt');
    await queryInterface.renameColumn('events', 'updated_at', 'updatedAt');
  }
};
