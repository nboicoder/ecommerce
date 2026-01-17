const { sequelize, db } = require('../config/db');
const { Category, Product } = db;

// Define the reduced set of categories
const reducedCategories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Home & Kitchen', description: 'Home appliances and kitchen items' },
  { name: 'Books', description: 'Books and literature' },
  { name: 'Beauty', description: 'Beauty and personal care products' }
];

async function reduceCategories() {
  try {
    console.log('Starting category reduction process...');

    // Delete all existing categories and products
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    console.log('Deleted all existing categories and products');

    // Create the reduced set of categories
    const createdCategories = [];
    for (const categoryData of reducedCategories) {
      const imageUrl = `https://placehold.co/300x300/3b82f6/FFFFFF?text=${encodeURIComponent(categoryData.name)}`;
      const category = await Category.create({
        ...categoryData,
        slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: imageUrl,
        imagePublicId: `category_${categoryData.name.toLowerCase().replace(/\s+/g, '_')}`
      });
      createdCategories.push(category);
      console.log(`Created category: ${categoryData.name}`);
    }

    console.log(`Created ${createdCategories.length} categories successfully`);

    // Generate products for the reduced categories
    const productNamesByCategory = {
      'Electronics': [
        'Wireless Bluetooth Headphones', 'Smartphone', 'Laptop Computer', 'Tablet Device', 
        'Digital Camera', 'Smart TV', 'Gaming Console', 'External Hard Drive'
      ],
      'Clothing': [
        'Cotton T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Winter Coat', 'Summer Dress',
        'Formal Shirt', 'Casual Pants', 'Running Shoes'
      ],
      'Home & Kitchen': [
        'Coffee Maker', 'Blender', 'Microwave Oven', 'Refrigerator', 'Dishwasher',
        'Toaster', 'Electric Kettle', 'Rice Cooker'
      ],
      'Books': [
        'Bestselling Novel', 'Biography', 'History Book', 'Science Fiction', 'Fantasy Novel',
        'Mystery Novel', 'Thriller', 'Romance Novel'
      ],
      'Beauty': [
        'Facial Cleanser', 'Moisturizer', 'Sunscreen', 'Serum', 'Eye Cream',
        'Face Mask', 'Toner', 'Exfoliator'
      ]
    };

    const sampleBrands = [
      'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Microsoft', 'Google', 'Amazon',
      'LG', 'Panasonic', 'Canon', 'Nikon', 'Dell', 'HP', 'Lenovo'
    ];

    let totalProductsCreated = 0;
    for (const category of createdCategories) {
      const categoryProductNames = productNamesByCategory[category.name] || [
        `${category.name} Item A`, `${category.name} Item B`, `${category.name} Item C`
      ];

      for (let i = 0; i < categoryProductNames.length; i++) {
        const productName = categoryProductNames[i];
        const uniqueSuffix = Math.floor(Math.random() * 1000); // Add random number to ensure uniqueness
        
        const product = await Product.create({
          name: `${productName} ${uniqueSuffix}`,
          slug: `${productName.toLowerCase().replace(/\s+/g, '-')}-${uniqueSuffix}`,
          description: `High-quality ${productName.toLowerCase()} with premium features.`,
          price: parseFloat((Math.random() * 500 + 10).toFixed(2)), // Random price between $10-$510
          categoryId: category.id,
          brand: sampleBrands[Math.floor(Math.random() * sampleBrands.length)],
          stock: Math.floor(Math.random() * 100) + 1, // Random stock between 1-100
          images: [
            `https://placehold.co/600x600/3b82f6/FFFFFF?text=${encodeURIComponent(productName)}`,
            `https://placehold.co/600x600/ef4444/FFFFFF?text=${encodeURIComponent(productName)}`,
            `https://placehold.co/600x600/10b981/FFFFFF?text=${encodeURIComponent(productName)}`
          ],
          rating: parseFloat((Math.random() * 3.5 + 1.5).toFixed(1)), // Rating between 1.5-5.0
          numReviews: Math.floor(Math.random() * 500), // Random number of reviews
          featured: Math.random() > 0.7, // 30% chance of being featured
          freeShipping: Math.random() > 0.5 // 50% chance of free shipping
        });
        
        totalProductsCreated++;
        console.log(`Created product: ${productName} in category: ${category.name}`);
      }
    }

    console.log(`\nDatabase updated successfully!`);
    console.log(`- Created ${createdCategories.length} categories`);
    console.log(`- Created ${totalProductsCreated} products`);
    
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error reducing categories:', error);
    process.exit(1);
  }
}

// Run the reduction if this file is executed directly
if (require.main === module) {
  reduceCategories();
}

module.exports = { reduceCategories };