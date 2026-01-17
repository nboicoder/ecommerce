const { sequelize } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

// Sample data to populate the database
const sampleData = {
  categories: [
    {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      imageUrl: 'https://placehold.co/300x300/3b82f6/FFFFFF?text=Electronics',
      imagePublicId: 'electronics_placeholder'
    },
    {
      name: 'Clothing',
      description: 'Fashion and apparel',
      imageUrl: 'https://placehold.co/300x300/ef4444/FFFFFF?text=Clothing',
      imagePublicId: 'clothing_placeholder'
    },
    {
      name: 'Home & Kitchen',
      description: 'Home appliances and kitchen items',
      imageUrl: 'https://placehold.co/300x300/10b981/FFFFFF?text=Home+%26+Kitchen',
      imagePublicId: 'home_kitchen_placeholder'
    },
    {
      name: 'Books',
      description: 'Books and literature',
      imageUrl: 'https://placehold.co/300x300/f97316/FFFFFF?text=Books',
      imagePublicId: 'books_placeholder'
    },
    {
      name: 'Beauty',
      description: 'Beauty and personal care products',
      imageUrl: 'https://placehold.co/300x300/ec4899/FFFFFF?text=Beauty',
      imagePublicId: 'beauty_placeholder'
    }
  ],
  users: [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user'
    }
  ],
  products: [
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      price: 129.99,
      brand: 'SoundMax',
      stock: 50,
      images: [
        'https://placehold.co/600x600/3b82f6/FFFFFF?text=Headphones',
        'https://placehold.co/600x600/6b7280/FFFFFF?text=Headphones+Side',
        'https://placehold.co/600x600/1e40af/FFFFFF?text=Headphones+Case'
      ],
      rating: 4.5,
      numReviews: 120,
      featured: true,
      freeShipping: true
    },
    {
      name: 'Smart Watch Series 5',
      description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
      price: 249.99,
      brand: 'TechTime',
      stock: 30,
      images: [
        'https://placehold.co/600x600/0ea5e9/FFFFFF?text=Smart+Watch',
        'https://placehold.co/600x600/0284c7/FFFFFF?text=Watch+Face',
        'https://placehold.co/600x600/0369a1/FFFFFF?text=Watch+Band'
      ],
      rating: 4.7,
      numReviews: 85,
      featured: true,
      freeShipping: false
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
      price: 19.99,
      brand: 'FashionPlus',
      stock: 200,
      images: [
        'https://placehold.co/600x600/f59e0b/FFFFFF?text=T-Shirt',
        'https://placehold.co/600x600/ef4444/FFFFFF?text=Red+T-Shirt',
        'https://placehold.co/600x600/8b5cf6/FFFFFF?text=Purple+T-Shirt'
      ],
      rating: 4.2,
      numReviews: 65,
      featured: false,
      freeShipping: true
    },
    {
      name: 'Coffee Maker Deluxe',
      description: 'Programmable coffee maker with thermal carafe and brew strength control.',
      price: 89.99,
      brand: 'HomeBrew',
      stock: 25,
      images: [
        'https://placehold.co/600x600/8b5cf6/FFFFFF?text=Coffee+Maker',
        'https://placehold.co/600x600/a855f7/FFFFFF?text=Coffee+Pot',
        'https://placehold.co/600x600/7e22ce/FFFFFF?text=Coffee+Machine'
      ],
      rating: 4.4,
      numReviews: 92,
      featured: true,
      freeShipping: true
    },
    {
      name: 'Bestseller Novel',
      description: 'Award-winning novel that topped the bestseller lists worldwide.',
      price: 14.99,
      brand: 'PublisherX',
      stock: 100,
      images: [
        'https://placehold.co/600x600/10b981/FFFFFF?text=Book+Cover',
        'https://placehold.co/600x600/059669/FFFFFF?text=Book+Spine',
        'https://placehold.co/600x600/047857/FFFFFF?text=Book+Pages'
      ],
      rating: 4.8,
      numReviews: 210,
      featured: true,
      freeShipping: true
    },
    {
      name: 'Skincare Set',
      description: 'Complete skincare routine with cleanser, toner, and moisturizer.',
      price: 49.99,
      brand: 'GlowUp',
      stock: 75,
      images: [
        'https://placehold.co/600x600/ec4899/FFFFFF?text=Skincare+Set',
        'https://placehold.co/600x600/db2777/FFFFFF?text=Cleanser',
        'https://placehold.co/600x600/be185d/FFFFFF?text=Moisturizer'
      ],
      rating: 4.6,
      numReviews: 145,
      featured: false,
      freeShipping: false
    }
  ],
  orders: [
    {
      orderItems: [
        {
          name: 'Wireless Bluetooth Headphones',
          qty: 1,
          price: 129.99,
          image: 'https://placehold.co/600x600/3b82f6/FFFFFF?text=Headphones'
        }
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'PayPal',
      taxPrice: 13.00,
      shippingPrice: 0.00,
      totalPrice: 142.99,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false
    },
    {
      orderItems: [
        {
          name: 'Cotton T-Shirt',
          qty: 2,
          price: 19.99,
          image: 'https://placehold.co/600x600/f59e0b/FFFFFF?text=T-Shirt'
        },
        {
          name: 'Bestseller Novel',
          qty: 1,
          price: 14.99,
          image: 'https://placehold.co/600x600/10b981/FFFFFF?text=Book+Cover'
        }
      ],
      shippingAddress: {
        address: '456 Oak Ave',
        city: 'Los Angeles',
        postalCode: '90210',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      taxPrice: 4.50,
      shippingPrice: 5.99,
      totalPrice: 50.47,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: true,
      deliveredAt: new Date()
    }
  ]
};

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Sync the database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // This will drop and recreate all tables
    console.log('Database synced successfully');

    // Hash passwords for users
    const hashedUsers = await Promise.all(sampleData.users.map(async (userData) => {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return {
        ...userData,
        password: hashedPassword
      };
    }));

    // Create users
    const createdUsers = await User.bulkCreate(hashedUsers, { returning: true });
    console.log(`Created ${createdUsers.length} users`);

    // Create categories
    const createdCategories = await Category.bulkCreate(sampleData.categories, { returning: true });
    console.log(`Created ${createdCategories.length} categories`);

    // Create products and associate them with categories
    const productsWithCategory = sampleData.products.map((product, index) => ({
      ...product,
      categoryId: createdCategories[index % createdCategories.length].id
    }));

    const createdProducts = await Product.bulkCreate(productsWithCategory, { returning: true });
    console.log(`Created ${createdProducts.length} products`);

    // Create orders and associate them with users
    const ordersWithUsers = sampleData.orders.map((order, index) => ({
      ...order,
      userId: createdUsers[index % createdUsers.length].id
    }));

    const createdOrders = await Order.bulkCreate(ordersWithUsers, { returning: true });
    console.log(`Created ${createdOrders.length} orders`);

    console.log('\nDatabase initialized successfully!');
    console.log('Sample data created:');
    console.log('- Categories: Electronics, Clothing, Home & Kitchen, Books, Beauty');
    console.log('- Users: Admin User, John Doe, Jane Smith');
    console.log('- Products: Wireless Headphones, Smart Watch, Cotton T-Shirt, Coffee Maker, Bestseller Novel, Skincare Set');
    console.log('- Orders: 2 sample orders with shipping and payment info');

    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, sampleData };