const fs = require('fs').promises;
const path = require('path');

// Create placeholder images for each category
async function createPlaceholderImages() {
  const categories = [
    'Electronics',
    'Clothing', 
    'Home & Kitchen',
    'Books',
    'Beauty'
  ];

  const publicDir = path.join(__dirname, '../public/images');

  for (const category of categories) {
    const categoryDir = path.join(publicDir, category);
    
    // Create category directory if it doesn't exist
    await fs.mkdir(categoryDir, { recursive: true });
    
    // Create category placeholder image
    const categoryImagePath = path.join(categoryDir, `category-${category.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    const categoryPlaceholder = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
      width: 400px;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      margin: 0;
    }
  </style>
</head>
<body>
  <h1>${category}</h1>
</body>
</html>`;
    
    await fs.writeFile(categoryImagePath.replace('.jpg', '.html'), categoryPlaceholder);
    
    // Create product placeholder images for this category
    for (let i = 1; i <= 3; i++) {
      const productImagePath = path.join(categoryDir, `${category.toLowerCase().replace(/\s+/g, '-')}-product-${i}.jpg`);
      const productPlaceholder = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 600px;
      width: 600px;
      background: linear-gradient(45deg, #10b981, #06b6d4);
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      margin: 0;
    }
  </style>
</head>
<body>
  <h1>${category} Product ${i}</h1>
</body>
</html>`;
      
      await fs.writeFile(productImagePath.replace('.jpg', '.html'), productPlaceholder);
    }
    
    console.log(`Created placeholder images for ${category} category`);
  }
  
  console.log('Placeholder images created successfully!');
}

// Run the function
createPlaceholderImages().catch(console.error);