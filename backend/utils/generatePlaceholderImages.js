const fs = require('fs').promises;
const path = require('path');
const { createCanvas } = require('canvas');

// Create placeholder images for each category
async function createPlaceholderImages() {
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
    
    // Create category placeholder image (300x300)
    const categoryCanvas = createCanvas(300, 300);
    const categoryCtx = categoryCanvas.getContext('2d');
    
    // Draw gradient background
    const categoryGradient = categoryCtx.createLinearGradient(0, 0, 300, 300);
    categoryGradient.addColorStop(0, '#3b82f6'); // blue-500
    categoryGradient.addColorStop(1, '#8b5cf6'); // violet-500
    
    categoryCtx.fillStyle = categoryGradient;
    categoryCtx.fillRect(0, 0, 300, 300);
    
    // Add text
    categoryCtx.fillStyle = 'white';
    categoryCtx.font = 'bold 20px Arial';
    categoryCtx.textAlign = 'center';
    categoryCtx.textBaseline = 'middle';
    
    // Split category name if it's too long
    const words = category.split(' ');
    if (words.length > 1) {
      categoryCtx.fillText(words[0], 150, 130);
      categoryCtx.fillText(words.slice(1).join(' '), 150, 170);
    } else {
      categoryCtx.fillText(category, 150, 150);
    }
    
    // Save category image
    const categoryBuffer = categoryCanvas.toBuffer('image/jpeg');
    const categoryImagePath = path.join(categoryDir, `category-${category.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    await fs.writeFile(categoryImagePath, categoryBuffer);
    console.log(`Created category image: ${categoryImagePath}`);
    
    // Create product placeholder images for this category (600x600)
    for (let i = 1; i <= 3; i++) {
      const productCanvas = createCanvas(600, 600);
      const productCtx = productCanvas.getContext('2d');
      
      // Draw gradient background
      const productGradient = productCtx.createLinearGradient(0, 0, 600, 600);
      const colors = [
        ['#10b981', '#06b6d4'], // teal to cyan
        ['#f59e0b', '#ef4444'], // amber to red
        ['#8b5cf6', '#ec4899']  // violet to pink
      ];
      const colorPair = colors[(i - 1) % colors.length];
      
      productGradient.addColorStop(0, colorPair[0]);
      productGradient.addColorStop(1, colorPair[1]);
      
      productCtx.fillStyle = productGradient;
      productCtx.fillRect(0, 0, 600, 600);
      
      // Add text
      productCtx.fillStyle = 'white';
      productCtx.font = 'bold 30px Arial';
      productCtx.textAlign = 'center';
      productCtx.textBaseline = 'middle';
      
      productCtx.fillText(`${category} Product`, 300, 270);
      productCtx.font = '20px Arial';
      productCtx.fillText(`#${i}`, 300, 330);
      
      // Save product image
      const productBuffer = productCanvas.toBuffer('image/jpeg');
      const productImagePath = path.join(categoryDir, `${category.toLowerCase().replace(/\s+/g, '-')}-product-${i}.jpg`);
      await fs.writeFile(productImagePath, productBuffer);
      console.log(`Created product image: ${productImagePath}`);
    }
  }
  
  console.log('All placeholder images created successfully!');
}

// Run the function
createPlaceholderImages().catch(console.error);