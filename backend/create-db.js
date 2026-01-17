const { Client } = require('pg');

async function createDatabase() {
  // Connect to PostgreSQL server (without specifying a database)
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '0000',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Check if database exists
    const dbExistsQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1;
    `;
    const dbExistsResult = await client.query(dbExistsQuery, [process.env.DB_NAME || 'ecommerce']);

    if (dbExistsResult.rowCount === 0) {
      // Create the database if it doesn't exist
      await client.query(`CREATE DATABASE "${process.env.DB_NAME || 'ecommerce'}"`);
      console.log(`Database ${(process.env.DB_NAME || 'ecommerce')} created successfully`);
    } else {
      console.log(`Database ${(process.env.DB_NAME || 'ecommerce')} already exists`);
    }

    // Close the connection
    await client.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error creating database:', error);
    await client.end();
    throw error;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('Database creation process completed');
    })
    .catch(error => {
      console.error('Database creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createDatabase };