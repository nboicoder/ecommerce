const { sequelize, db } = require('../config/db');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const https = require('https');

// Extract models from db object
const { Category, Product } = db;

// Create HTTPS agent to bypass SSL certificate issues if needed
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Sample categories to create
const sampleCategories = [
  'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 
  'Sports', 'Toys', 'Automotive', 'Health', 'Furniture',
  'Office Supplies', 'Pet Supplies', 'Jewelry', 'Shoes', 'Bags',
  'Watches', 'Cameras', 'Phones', 'Computers', 'Tablets',
  'Audio Equipment', 'Video Games', 'Movies', 'Music', 'Software',
  'Baby Products', 'Kids Toys', 'Outdoor Gear', 'Garden', 'Tools',
  'Lighting', 'Bedding', 'Cookware', 'Cutlery', 'Appliances',
  'Art Supplies', 'Crafts', 'Musical Instruments', 'Travel', 'Luggage',
  'Food & Beverages', 'Snacks', 'Beverages', 'Frozen Foods', 'Canned Goods',
  'Fresh Produce', 'Dairy', 'Bakery', 'Meat', 'Seafood'
];

// Sample brands for products
const sampleBrands = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Microsoft', 'Google', 'Amazon',
  'LG', 'Panasonic', 'Canon', 'Nikon', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer',
  'Bose', 'JBL', 'Beats', 'Fitbit', 'Garmin', 'GoPro', 'Tesla', 'Ford', 'Toyota',
  'Honda', 'BMW', 'Mercedes', 'Gucci', 'Prada', 'Chanel', 'Louis Vuitton', 'Hermès',
  'Rolex', 'Swatch', 'Casio', 'Seiko', 'Oakley', 'Ray-Ban', 'Levi\'s', 'Calvin Klein',
  'Ralph Lauren', 'Tommy Hilfiger', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'Old Navy',
  'Forever 21', 'Urban Outfitters', 'American Eagle', 'Victoria\'s Secret', 'Coach',
  'Michael Kors', 'Kate Spade', 'Tiffany & Co.', 'Cartier', 'Burberry', 'Mulberry',
  'Longchamp', 'MCM', 'Fossil', 'Timex', 'Movado', 'Breitling', 'Hublot', 'Tag Heuer',
  'Omega', 'Patek Philippe', 'Audemars Piguet', 'Vacheron Constantin', 'IWC Schaffhausen',
  'Jaeger-LeCoultre', 'Piaget', 'Van Cleef & Arpels', 'Chopard', 'Montblanc', 'Pandora',
  'Swarovski', 'Tissot', 'Citizen', 'Seiko', 'Casio', 'Timex', 'Skagen', 'Diesel',
  'Emporio Armani', 'Giorgio Armani', 'Versace', 'Dolce & Gabbana', 'Fendi', 'Givenchy',
  'Balenciaga', 'Saint Laurent', 'Alexander McQueen', 'Bottega Veneta', 'Valentino',
  'Dior', 'Chanel', 'Hermès', 'Louis Vuitton', 'Prada', 'Gucci', 'Ferragamo', 'Miu Miu',
  'Marni', 'Just Cavalli', 'Roberto Cavalli', 'Dsquared2', 'Moschino', 'Love Moschino',
  'Philipp Plein', 'Off-White', 'Supreme', 'BAPE', 'Stüssy', 'Vans', 'Converse', 'Puma',
  'Reebok', 'New Balance', 'Under Armour', 'ASICS', 'Brooks', 'Skechers', 'Dr. Martens',
  'Timberland', 'Clarks', 'Ecco', 'Geox', 'Cole Haan', 'Steve Madden', 'Michael Michael Kors',
  'Coach', 'Kate Spade', 'Tory Burch', 'Marc Jacobs', 'Calvin Klein', 'Ralph Lauren',
  'Tommy Hilfiger', 'Michael Kors', 'Coach', 'Kate Spade', 'Tory Burch', 'Marc Jacobs',
  'Calvin Klein', 'Ralph Lauren', 'Tommy Hilfiger', 'Michael Kors', 'Coach', 'Kate Spade',
  'Tory Brch', 'Marc Jacobs', 'Calvin Klein', 'Ralph Lauren', 'Tommy Hilfiger', 'Michael Kors'
];

// Sample product names by category
const productNamesByCategory = {
  'Electronics': [
    'Wireless Bluetooth Headphones', 'Smartphone', 'Laptop Computer', 'Tablet Device', 
    'Digital Camera', 'Smart TV', 'Gaming Console', 'External Hard Drive', 'USB Flash Drive',
    'Wireless Router', 'Smart Speaker', 'Fitness Tracker', 'Action Camera', 'VR Headset',
    'Wireless Earbuds', 'Smart Watch', 'Wireless Mouse', 'Mechanical Keyboard', 'Monitor',
    'Graphics Card', 'Processor', 'Memory RAM', 'Solid State Drive', 'Power Bank',
    'Wireless Charger', 'Streaming Device', 'Projector', 'Home Theater System', 'Surge Protector',
    'Network Switch', 'Ethernet Cable', 'HDMI Cable', 'USB Cable', 'Phone Case',
    'Screen Protector', 'Car Mount', 'Tripod', 'Selfie Stick', 'Microphone',
    'Webcam', 'Headset', 'Speakers', 'Subwoofer', 'Equalizer', 'Amplifier',
    'Receiver', 'Turntable', 'CD Player', 'MP3 Player', 'Radio'
  ],
  'Clothing': [
    'Cotton T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Winter Coat', 'Summer Dress',
    'Formal Shirt', 'Casual Pants', 'Running Shoes', 'Sneakers', 'Boots',
    'Sandals', 'Socks', 'Underwear', 'Sweater', 'Hoodie', 'Cardigan',
    'Blazer', 'Suit', 'Tie', 'Belt', 'Scarf', 'Gloves', 'Hat',
    'Cap', 'Swimsuit', 'Pajamas', 'Robe', 'Slippers', 'Sunglasses',
    'Sunglasses Case', 'Wallet', 'Handkerchief', 'Bow Tie', 'Cufflinks',
    'Pocket Square', 'Shoe Polish', 'Insoles', 'Shoelaces', 'Bra',
    'Panties', 'Stockings', 'Leggings', 'Yoga Pants', 'Shorts', 'Skirt',
    'Blouse', 'Tank Top', 'Crop Top', 'Kimono', 'Duster', 'Kaftan',
    'Peacoat', 'Trench Coat', 'Windbreaker', 'Raincoat', 'Down Jacket'
  ],
  'Home & Kitchen': [
    'Coffee Maker', 'Blender', 'Microwave Oven', 'Refrigerator', 'Dishwasher',
    'Toaster', 'Electric Kettle', 'Rice Cooker', 'Slow Cooker', 'Pressure Cooker',
    'Air Fryer', 'Stand Mixer', 'Food Processor', 'Juicer', 'Grill Pan',
    'Non-stick Pan', 'Cast Iron Skillet', 'Chef Knife', 'Cutting Board', 'Mixing Bowls',
    'Measuring Cups', 'Measuring Spoons', 'Can Opener', 'Peeler', 'Colander',
    'Strainer', 'Whisk', 'Spatula', 'Wooden Spoon', 'Tongs', 'Ladle',
    'Teapot', 'Coffee Mug', 'Water Bottle', 'Glassware', 'Plates', 'Bowls',
    'Cutlery Set', 'Serving Platter', 'Tray', 'Coasters', 'Napkins',
    'Tablecloth', 'Chair Cushion', 'Throw Pillow', 'Blanket', 'Rug',
    'Curtains', 'Lamp', 'Nightstand', 'Desk', 'Chair', 'Bookshelf',
    'Storage Box', 'Basket', 'Laundry Basket', 'Trash Can', 'Vacuum Cleaner',
    'Iron', 'Steamer', 'Washing Machine', 'Dryer', 'Mop', 'Broom',
    'Dustpan', 'Cleaning Supplies', 'Sponges', 'Paper Towels', 'Toilet Paper'
  ],
  'Books': [
    'Bestselling Novel', 'Biography', 'History Book', 'Science Fiction', 'Fantasy Novel',
    'Mystery Novel', 'Thriller', 'Romance Novel', 'Self-Help Book', 'Cookbook',
    'Textbook', 'Reference Book', 'Dictionary', 'Encyclopedia', 'Atlas',
    'Poetry Collection', 'Play', 'Essay Collection', 'Journal', 'Notebook',
    'Diary', 'Planner', 'Calendar', 'Magazine', 'Comic Book', 'Graphic Novel',
    'Children\'s Book', 'Young Adult Novel', 'Academic Journal', 'Research Paper',
    'Technical Manual', 'Instruction Guide', 'Recipe Book', 'Travel Guide', 'Language Learning Book',
    'Mathematics Textbook', 'Physics Textbook', 'Chemistry Textbook', 'Biology Textbook', 'Literature Textbook',
    'Philosophy Book', 'Psychology Book', 'Economics Book', 'Political Science Book', 'Sociology Book',
    'Anthropology Book', 'Archaeology Book', 'Geography Book', 'Astronomy Book', 'Medicine Textbook',
    'Law Book', 'Business Book', 'Marketing Book', 'Finance Book', 'Accounting Book',
    'Management Book', 'Engineering Book', 'Computer Science Book', 'Art Book', 'Music Book'
  ],
  'Beauty': [
    'Facial Cleanser', 'Moisturizer', 'Sunscreen', 'Serum', 'Eye Cream',
    'Face Mask', 'Toner', 'Exfoliator', 'Lip Balm', 'Foundation',
    'Concealer', 'Powder', 'Blush', 'Eyeshadow Palette', 'Eyeliner',
    'Mascara', 'Lipstick', 'Lip Gloss', 'Makeup Remover', 'Primer',
    'Setting Spray', 'BB Cream', 'CC Cream', 'Contour Kit', 'Highlighter',
    'Bronzer', 'Makeup Brushes', 'Sponge', 'Eyebrow Pencil', 'Eyebrow Gel',
    'False Eyelashes', 'Nail Polish', 'Base Coat', 'Top Coat', 'Nail File',
    'Cuticle Oil', 'Nail Clippers', 'Perfume', 'Cologne', 'Body Lotion',
    'Body Wash', 'Shampoo', 'Conditioner', 'Hair Serum', 'Hair Oil',
    'Hair Dryer', 'Straightener', 'Curling Iron', 'Comb', 'Brush',
    'Razor', 'Shaving Cream', 'After Shave', 'Deodorant', 'Antiperspirant',
    'Body Scrub', 'Salt Scrub', 'Sugar Scrub', 'Foot Cream', 'Hand Cream'
  ],
  'Sports': [
    'Tennis Racket', 'Golf Clubs', 'Basketball', 'Soccer Ball', 'Football',
    'Baseball Bat', 'Baseball Glove', 'Hockey Stick', 'Skates', 'Ski Equipment',
    'Snowboard', 'Bicycle', 'Helmet', 'Knee Pads', 'Elbow Pads',
    'Gym Bag', 'Water Bottle', 'Towel', 'Yoga Mat', 'Dumbbells',
    'Resistance Bands', 'Exercise Ball', 'Pull-up Bar', 'Ab Wheel', 'Jump Rope',
    'Weight Bench', 'Treadmill', 'Elliptical', 'Rowing Machine', 'Exercise Bike',
    'Golf Balls', 'Tennis Balls', 'Baseballs', 'Softballs', 'Volleyball',
    'Badminton Racket', 'Shuttlecocks', 'Ping Pong Paddle', 'Ping Pong Balls', 'Pool Cue',
    'Pool Balls', 'Bowling Ball', 'Bowling Pins', 'Boxing Gloves', 'Heavy Bag',
    'Speed Bag', 'Focus Mitts', 'Martial Arts Gi', 'Karate Belt', 'Taekwondo Uniform',
    'Fencing Foil', 'Protective Gear', 'Sports Watch', 'Heart Rate Monitor', 'GPS Watch'
  ],
  'Toys': [
    'Action Figure', 'Doll', 'Building Blocks', 'Board Game', 'Puzzle',
    'Toy Car', 'Dollhouse', 'Teddy Bear', 'Stuffed Animal', 'Remote Control Car',
    'Drone', 'LEGO Set', 'Play-Doh', 'Crayons', 'Coloring Book',
    'Toy Train', 'Rocking Horse', 'Tricycle', 'Scooter', 'Skateboard',
    'Bicycle', 'Hula Hoop', 'Jump Rope', 'Yo-yo', 'Kite',
    'Marbles', 'Dice', 'Playing Cards', 'Video Game', 'Game Controller',
    'Virtual Reality Headset', 'Educational Toy', 'Science Kit', 'Art Set', 'Musical Instrument',
    'Keyboard', 'Guitar', 'Drums', 'Recorder', 'Harmonica', 'Ukulele',
    'Violin', 'Cello', 'Trumpet', 'Saxophone', 'Flute', 'Clarinet',
    'Trombone', 'French Horn', 'Bagpipes', 'Accordion', 'Banjo', 'Mandolin',
    'Piano', 'Organ', 'Synthesizer', 'Sampler', 'Drum Machine', 'Sequencer'
  ],
  'Automotive': [
    'Floor Mats', 'Seat Covers', 'Car Cover', 'Car Wax', 'Window Cleaner',
    'Tire Pressure Gauge', 'Jack', 'Tire Iron', 'Emergency Kit', 'Jump Starter',
    'Car Charger', 'Phone Mount', 'Dash Cam', 'Backup Camera', 'GPS Navigation',
    'Car Stereo', 'Subwoofer', 'Speaker', 'Amplifier', 'Equalizer',
    'Car Alarm', 'Remote Starter', 'Security Camera', 'Car Wash Soap', 'Polish',
    'Wiper Blades', 'Air Filter', 'Oil Filter', 'Spark Plugs', 'Brake Pads',
    'Tires', 'Rims', 'Hubcaps', 'Mud Flaps', 'Bug Deflector',
    'Spoiler', 'Body Kit', 'Decals', 'Stickers', 'License Plate Frame',
    'Hitch', 'Trailer Hitch', 'Cargo Carrier', 'Bike Rack', 'Roof Rack',
    'Ladder Rack', 'Tonneau Cover', 'Bed Liner', 'Tool Box', 'Winch'
  ],
  'Health': [
    'Blood Pressure Monitor', 'Thermometer', 'Digital Scale', 'Pedometer', 'Blood Glucose Meter',
    'Insulin Syringes', 'Test Strips', 'Pill Organizer', 'First Aid Kit', 'Bandages',
    'Antiseptic', 'Pain Reliever', 'Allergy Medication', 'Vitamins', 'Supplements',
    'Protein Powder', 'Multivitamin', 'Fish Oil', 'Calcium', 'Magnesium',
    'Vitamin D', 'Vitamin C', 'B-Complex', 'Probiotics', 'Digestive Enzymes',
    'Sleep Aid', 'Melatonin', 'Herbal Tea', 'Essential Oils', 'Diffuser',
    'Humidifier', 'Air Purifier', 'HEPA Filter', 'Face Mask', 'Hand Sanitizer',
    'Disinfectant Wipes', 'Tissues', 'Toothbrush', 'Toothpaste', 'Mouthwash',
    'Floss', 'Tongue Scraper', 'Electric Toothbrush', 'Replacement Brush Heads', 'Water Flosser'
  ],
  'Furniture': [
    'Sofa', 'Coffee Table', 'Dining Table', 'Dining Chairs', 'Bed Frame',
    'Mattress', 'Nightstand', 'Dresser', 'Wardrobe', 'Bookshelf',
    'TV Stand', 'Desk', 'Office Chair', 'Bar Stools', 'Couch',
    'Recliner', 'Ottoman', 'Bean Bag', 'Rocking Chair', 'Armchair',
    'Sectional Sofa', 'Futon', 'Daybed', 'Trundle Bed', 'Bunk Bed',
    'Crib', 'Changing Table', 'Chest', 'Cabinet', 'Sideboard', 'Buffet',
    'China Cabinet', 'Display Case', 'Entertainment Center', 'Media Console', 'Side Table',
    'End Table', 'Console Table', 'Accent Table', 'Piano Bench', 'Storage Bench',
    'Bench', 'Stool', 'Footrest', 'Chaise Lounge', 'Loveseat', 'Settee',
    'Divan', 'Daybed', 'Sleeper Sofa', 'Murphy Bed', 'Wall Bed', 'Canopy Bed'
  ],
  // Add more categories as needed
};

// Generate realistic product descriptions
function generateDescription(productName, category) {
  const descriptors = [
    'High-quality', 'Premium', 'Professional', 'Durable', 'Reliable', 
    'Elegant', 'Modern', 'Classic', 'Stylish', 'Comfortable',
    'Lightweight', 'Compact', 'Portable', 'Versatile', 'Multi-functional',
    'Eco-friendly', 'Sustainable', 'Organic', 'Natural', 'Pure'
  ];
  
  const features = [
    'with advanced technology', 'designed for comfort', 'built to last', 
    'perfect for everyday use', 'ideal for professionals', 'suitable for beginners',
    'easy to use', 'simple to maintain', 'quick to set up', 'ready to go',
    'ergonomic design', 'breathable material', 'adjustable settings', 'customizable options',
    'energy efficient', 'water resistant', 'scratch resistant', 'stain resistant'
  ];
  
  const audiences = [
    'for home use', 'for office use', 'for travel', 'for outdoor activities',
    'for sports enthusiasts', 'for busy professionals', 'for families', 'for students',
    'for fitness lovers', 'for creative minds', 'for tech enthusiasts', 'for fashion lovers'
  ];
  
  const desc = `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${productName.toLowerCase()} ${features[Math.floor(Math.random() * features.length)]} ${audiences[Math.floor(Math.random() * audiences.length)]}.`;
  
  return desc.charAt(0).toUpperCase() + desc.slice(1);
}

// Function to generate placeholder image URLs instead of downloading
function generatePlaceholderImageUrls(category) {
  // Using placeholder images that don't require downloading
  const imageUrls = [
    `https://placehold.co/600x600/3b82f6/FFFFFF?text=${encodeURIComponent(category)}`,
    `https://placehold.co/600x600/ef4444/FFFFFF?text=${encodeURIComponent(category)}`,
    `https://placehold.co/600x600/10b981/FFFFFF?text=${encodeURIComponent(category)}`
  ];

  return imageUrls;
}

// Function to generate random images for products
function generateProductImages(category) {
  // Generate placeholder image URLs instead of downloading
  return generatePlaceholderImageUrls(category);
}

// Function to populate the database with sample data
async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Clear existing data
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    console.log('Cleared existing products and categories');

    // Create categories
    console.log(`Creating ${sampleCategories.length} categories...`);
    const createdCategories = [];
    
    for (const categoryName of sampleCategories) {
      // Generate a placeholder image for the category
      const localImageUrl = `https://placehold.co/300x300/3b82f6/FFFFFF?text=${encodeURIComponent(categoryName)}`;
      
      const category = await Category.create({
        name: categoryName,
        description: `Products related to ${categoryName.toLowerCase()}`,
        imageUrl: localImageUrl,
        imagePublicId: `category_${categoryName.toLowerCase().replace(/\s+/g, '_')}`
      });
      
      createdCategories.push(category);
      console.log(`Created category: ${categoryName}`);
    }

    console.log(`Created ${createdCategories.length} categories successfully`);

    // Calculate how many products to create per category to reach ~500 total
    const totalProducts = 500; // Adjust this number as needed
    const productsPerCategory = Math.floor(totalProducts / createdCategories.length);
    const remainingProducts = totalProducts % createdCategories.length;

    console.log(`Creating approximately ${totalProducts} products across ${createdCategories.length} categories...`);

    let productCount = 0;
    
    // Create products for each category
    for (let i = 0; i < createdCategories.length; i++) {
      const category = createdCategories[i];
      const numProductsForThisCategory = i < remainingProducts ? productsPerCategory + 1 : productsPerCategory;
      
      console.log(`Creating ${numProductsForThisCategory} products for category: ${category.name}`);
      
      // Get product names for this category, or use generic names if not defined
      const categoryProductNames = productNamesByCategory[category.name] || [
        `${category.name} Item A`, `${category.name} Item B`, `${category.name} Item C`,
        `${category.name} Product X`, `${category.name} Product Y`, `${category.name} Product Z`
      ];
      
      for (let j = 0; j < numProductsForThisCategory; j++) {
        // Select a product name, cycling through the available names if needed
        const productNameIndex = j % categoryProductNames.length;
        const productName = categoryProductNames[productNameIndex];
        
        // Generate a unique name variation with a random number to ensure uniqueness
        const nameVariants = ['Standard', 'Deluxe', 'Premium', 'Pro', 'Lite', 'Max', 'Ultra'];
        const variant = nameVariants[Math.floor(Math.random() * nameVariants.length)];
        const uniqueSuffix = Math.floor(Math.random() * 10000); // Add random number to ensure uniqueness
        const finalProductName = `${variant} ${productName} ${uniqueSuffix}`;
        
        // Generate product images
        const productImages = generateProductImages(category.name);
        
        // Create the product
        const product = await Product.create({
          name: finalProductName,
          slug: finalProductName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: generateDescription(finalProductName, category.name),
          price: parseFloat((Math.random() * 500 + 10).toFixed(2)), // Random price between $10-$510
          categoryId: category.id,
          brand: sampleBrands[Math.floor(Math.random() * sampleBrands.length)],
          stock: Math.floor(Math.random() * 100) + 1, // Random stock between 1-100
          images: productImages,
          rating: parseFloat((Math.random() * 3.5 + 1.5).toFixed(1)), // Rating between 1.5-5.0
          numReviews: Math.floor(Math.random() * 500), // Random number of reviews
          featured: Math.random() > 0.7, // 30% chance of being featured
          freeShipping: Math.random() > 0.5 // 50% chance of free shipping
        });
        
        productCount++;
        
        if (productCount % 50 === 0) {
          console.log(`Created ${productCount}/${totalProducts} products...`);
        }
      }
    }

    console.log(`\nDatabase populated successfully!`);
    console.log(`- Created ${createdCategories.length} categories`);
    console.log(`- Created ${productCount} products`);
    
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

// Run the population if this file is executed directly
if (require.main === module) {
  populateDatabase();
}

module.exports = { populateDatabase };