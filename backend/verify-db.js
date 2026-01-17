const { sequelize } = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function verifyDatabase() {
  try {
    console.log('Verifying database population...\n');
    
    // Count records in each table
    const categoryCount = await Category.count();
    const userCount = await User.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();
    
    console.log(`Categories: ${categoryCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}\n`);
    
    // Fetch and display sample records
    console.log('Sample Categories:');
    const categories = await Category.findAll({ limit: 5 });
    categories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.description}`);
    });
    
    console.log('\nSample Users:');
    const users = await User.findAll({ limit: 5 });
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}), Role: ${user.role}`);
    });
    
    console.log('\nSample Products:');
    const products = await Product.findAll({ limit: 5 });
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price}, Stock: ${product.stock}, Rating: ${product.rating}`);
      console.log(`  Images: ${product.images.length} available`);
    });
    
    console.log('\nSample Orders:');
    const orders = await Order.findAll({ limit: 5 });
    orders.forEach(order => {
      console.log(`- Order Total: $${order.totalPrice}, Paid: ${order.isPaid}, Delivered: ${order.isDelivered}`);
      console.log(`  Items: ${order.orderItems.length}, User ID: ${order.userId}`);
    });
    
    console.log('\nDatabase verification completed successfully!');
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Error verifying database:', error);
    process.exit(1);
  }
}

verifyDatabase();