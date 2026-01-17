const { sequelize, db } = require('../config/db');
const { Category, Product } = db;

async function updateLocalImages() {
  try {
    console.log('Updating database with local image paths...');

    // Get all categories
    const categories = await Category.findAll();
    
    // Define local image paths for each category
    const categoryImages = {
      'Electronics': '/images/Electronics/category-electronics.jpg',
      'Clothing': '/images/Clothing/category-clothing.jpg',
      'Home & Kitchen': '/images/Home & Kitchen/category-home-kitchen.jpg',
      'Books': '/images/Books/category-books.jpg',
      'Beauty': '/images/Beauty/category-beauty.jpg'
    };

    // Update category images
    for (const category of categories) {
      const imagePath = categoryImages[category.name];
      if (imagePath) {
        await Category.update(
          { imageUrl: imagePath },
          { where: { id: category.id } }
        );
        console.log(`Updated category ${category.name} with local image: ${imagePath}`);
      }
    }

    // Get all products
    const products = await Product.findAll();
    
    // Define local image paths for products by category
    const productImages = {
      'Electronics': [
        '/images/Electronics/electronics-product-1.jpg',
        '/images/Electronics/electronics-product-2.jpg',
        '/images/Electronics/electronics-product-3.jpg'
      ],
      'Clothing': [
        '/images/Clothing/clothing-product-1.jpg',
        '/images/Clothing/clothing-product-2.jpg',
        '/images/Clothing/clothing-product-3.jpg'
      ],
      'Home & Kitchen': [
        '/images/Home & Kitchen/home-kitchen-product-1.jpg',
        '/images/Home & Kitchen/home-kitchen-product-2.jpg',
        '/images/Home & Kitchen/home-kitchen-product-3.jpg'
      ],
      'Books': [
        '/images/Books/books-product-1.jpg',
        '/images/Books/books-product-2.jpg',
        '/images/Books/books-product-3.jpg'
      ],
      'Beauty': [
        '/images/Beauty/beauty-product-1.jpg',
        '/images/Beauty/beauty-product-2.jpg',
        '/images/Beauty/beauty-product-3.jpg'
      ]
    };

    // Update product images
    for (const product of products) {
      // Find the category for this product
      const category = categories.find(cat => cat.id === product.categoryId);
      
      if (category && productImages[category.name]) {
        const images = [...productImages[category.name]]; // Copy the array to avoid reference issues
        await Product.update(
          { images: images },
          { where: { id: product.id } }
        );
        console.log(`Updated product ${product.name} with local images`);
      }
    }

    console.log('Database updated with local image paths successfully!');
    
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error updating local images:', error);
    process.exit(1);
  }
}

// Run the update if this file is executed directly
if (require.main === module) {
  updateLocalImages();
}

module.exports = { updateLocalImages };