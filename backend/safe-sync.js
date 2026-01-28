const { sequelize, db } = require('./config/models-index');

async function safeSync() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully.');

    // Import all models to register associations
    const fs = require('fs');
    const path = require('path');
    
    const modelFiles = fs.readdirSync(__dirname + '/models').filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    });

    // Import all models to register associations
    for (const file of modelFiles) {
      const modelFn = require(path.join(__dirname, 'models', file));
      const model = modelFn(sequelize, require('sequelize'));
      db[model.name] = model;
    }

    // Define associations
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
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

    console.log('Starting safe synchronization...');
    
    // Use sync with alter: false to preserve existing data
    // Only create tables that don't exist
    await sequelize.sync({ 
      alter: false,  // Don't alter existing tables to preserve data
      force: false   // Don't drop existing tables
    });
    
    console.log('Database synchronized safely. Data preserved.');
  } catch (error) {
    console.error('Safe sync failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  safeSync();
}

module.exports = safeSync;