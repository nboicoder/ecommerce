const fs = require('fs').promises;
const path = require('path');

// Create placeholder text files for each category
async function createPlaceholderFiles() {
  const categories = [
    'Electronics',
    'Clothing', 
    'Home & Kitchen',
    'Books',
    'Beauty'
  ];

  const publicDir = path.join(__dirname, '../../public/images');

  for (const category of categories) {
    const categoryDir = path.join(publicDir, category);
    
    // Create category directory if it doesn't exist
    await fs.mkdir(categoryDir, { recursive: true });
    
    // Create category placeholder file
    const categoryFilePath = path.join(categoryDir, `category-${category.toLowerCase().replace(/\s+/g, '-')}.txt`);
    await fs.writeFile(categoryFilePath, `This is a placeholder for the ${category} category image.\nActual image files should be placed here.`);
    console.log(`Created category placeholder: ${categoryFilePath}`);
    
    // Create product placeholder files for this category
    for (let i = 1; i <= 3; i++) {
      const productFilePath = path.join(categoryDir, `${category.toLowerCase().replace(/\s+/g, '-')}-product-${i}.txt`);
      await fs.writeFile(productFilePath, `This is a placeholder for ${category} product ${i} image.\nActual image files should be placed here.`);
      console.log(`Created product placeholder: ${productFilePath}`);
    }
  }
  
  console.log('Placeholder files created successfully! Place actual image files in these directories.');
}

// Run the function
createPlaceholderFiles().catch(console.error);