const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

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

const db = {};

// Load all models
const modelFiles = fs.readdirSync(__dirname + '/../models').filter(file => {
  return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
});

// Import all models
for (const file of modelFiles) {
  const modelFn = require(path.join(__dirname, '..', 'models', file));
  const model = modelFn(sequelize, Sequelize);
  db[model.name] = model;
}

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add association methods to models
Object.keys(db).forEach(modelName => {
  if (modelName === 'Product' && db.Category) {
    db[modelName].associate = function(models) {
      this.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    };
  } else if (modelName === 'Category' && db.Product) {
    db[modelName].associate = function(models) {
      this.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
    };
  } else if (modelName === 'Order' && db.User) {
    db[modelName].associate = function(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
  }
});

// Alternative manual association approach
if (db.Product && db.Category) {
  db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });
  db.Category.hasMany(db.Product, { foreignKey: 'categoryId', as: 'products' });
}

if (db.Order && db.User) {
  db.Order.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
}

module.exports = { sequelize, db, connectDB: async () => {
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
}};