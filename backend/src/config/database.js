const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_PASSWORD);
console.log(process.env.POSTGRES_HOST);

const sequelize = new Sequelize({
  database: 'voyagr',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: 5432,
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize; 