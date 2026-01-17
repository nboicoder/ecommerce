#!/usr/bin/env node

// Script to initialize the database with sample data
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { initializeDatabase } = require('./utils/initializeDb');

console.log('Starting database initialization process...');
console.log('This will create all tables and populate them with sample data.');

initializeDatabase()
  .then(() => {
    console.log('Database initialization completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });