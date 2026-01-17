const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: console.log, // Set to false in production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully');
    
    // Sync all models - this will create tables if they don't exist
    await sequelize.sync({ alter: true }); // Use 'alter: true' to update existing tables
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };