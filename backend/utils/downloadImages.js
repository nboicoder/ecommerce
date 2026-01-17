const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');

// Convert fs functions to promises
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Free image sources
const imageSources = [
  // Electronics
  {
    category: 'Electronics',
    urls: [
      'https://source.unsplash.com/600x600/?smartphone,technology',
      'https://source.unsplash.com/600x600/?laptop,computer',
      'https://source.unsplash.com/600x600/?headphones,audio',
      'https://source.unsplash.com/600x600/?camera,photography',
      'https://source.unsplash.com/600x600/?tablet,device',
      'https://source.unsplash.com/600x600/?smartwatch,gadget',
      'https://source.unsplash.com/600x600/?speaker,sound',
      'https://source.unsplash.com/600x600/?console,gaming',
      'https://source.unsplash.com/600x600/?drone,flying',
      'https://source.unsplash.com/600x600/?vr,virtual-reality'
    ]
  },
  // Clothing
  {
    category: 'Clothing',
    urls: [
      'https://source.unsplash.com/600x600/?shirt,clothing',
      'https://source.unsplash.com/600x600/?dress,fashion',
      'https://source.unsplash.com/600x600/?shoes,footwear',
      'https://source.unsplash.com/600x600/?hat,cap',
      'https://source.unsplash.com/600x600/?jacket,outerwear',
      'https://source.unsplash.com/600x600/?jeans,pants',
      'https://source.unsplash.com/600x600/?sneakers,athletic',
      'https://source.unsplash.com/600x600/?skirt,female',
      'https://source.unsplash.com/600x600/?suit,business',
      'https://source.unsplash.com/600x600/?swimsuit,beach'
    ]
  },
  // Home & Kitchen
  {
    category: 'Home & Kitchen',
    urls: [
      'https://source.unsplash.com/600x600/?sofa,living-room',
      'https://source.unsplash.com/600x600/?bedroom,furniture',
      'https://source.unsplash.com/600x600/?kitchen,appliances',
      'https://source.unsplash.com/600x600/?dining-table,interior',
      'https://source.unsplash.com/600x600/?lamp,lighting',
      'https://source.unsplash.com/600x600/?couch,seating',
      'https://source.unsplash.com/600x600/?blender,kitchenware',
      'https://source.unsplash.com/600x600/?microwave,cooking',
      'https://source.unsplash.com/600x600/?refrigerator,white-appliance',
      'https://source.unsplash.com/600x600/?toaster,kitchen'
    ]
  },
  // Books
  {
    category: 'Books',
    urls: [
      'https://source.unsplash.com/600x600/?bookshelf,library',
      'https://source.unsplash.com/600x600/?novel,reading',
      'https://source.unsplash.com/600x600/?magazine,publication',
      'https://source.unsplash.com/600x600/?ebook,digital',
      'https://source.unsplash.com/600x600/?study,education',
      'https://source.unsplash.com/600x600/?writing,author',
      'https://source.unsplash.com/600x600/?fiction,literature',
      'https://source.unsplash.com/600x600/?textbook,academic',
      'https://source.unsplash.com/600x600/?poetry,verse',
      'https://source.unsplash.com/600x600/?comic,graphic'
    ]
  },
  // Beauty
  {
    category: 'Beauty',
    urls: [
      'https://source.unsplash.com/600x600/?skincare,face',
      'https://source.unsplash.com/600x600/?makeup,cosmetics',
      'https://source.unsplash.com/600x600/?perfume,fragrance',
      'https://source.unsplash.com/600x600/?haircare,hair',
      'https://source.unsplash.com/600x600/?nails,manicure',
      'https://source.unsplash.com/600x600/?spa,treatment',
      'https://source.unsplash.com/600x600/?lipstick,color',
      'https://source.unsplash.com/600x600/?eyeshadow,makeup',
      'https://source.unsplash.com/600x600/?foundation,base',
      'https://source.unsplash.com/600x600/?mascara,eyelashes'
    ]
  },
  // Sports & Outdoors
  {
    category: 'Sports & Outdoors',
    urls: [
      'https://source.unsplash.com/600x600/?running,exercise',
      'https://source.unsplash.com/600x600/?yoga,fitness',
      'https://source.unsplash.com/600x600/?basketball,sport',
      'https://source.unsplash.com/600x600/?hiking,outdoor',
      'https://source.unsplash.com/600x600/?tennis,racket',
      'https://source.unsplash.com/600x600/?swimming,pool',
      'https://source.unsplash.com/600x600/?cycling,bike',
      'https://source.unsplash.com/600x600/?football,soccer',
      'https://source.unsplash.com/600x600/?surfing,ocean',
      'https://source.unsplash.com/600x600/?camping,tent'
    ]
  },
  // Toys & Games
  {
    category: 'Toys & Games',
    urls: [
      'https://source.unsplash.com/600x600/?puzzle,toy',
      'https://source.unsplash.com/600x600/?board-game,tabletop',
      'https://source.unsplash.com/600x600/?doll,figure',
      'https://source.unsplash.com/600x600/?lego,building',
      'https://source.unsplash.com/600x600/?action-figure,collectible',
      'https://source.unsplash.com/600x600/?video-game,digital',
      'https://source.unsplash.com/600x600/?card-game,playing',
      'https://source.unsplash.com/600x600/?teddy-bear,plush',
      'https://source.unsplash.com/600x600/?remote-control,toy-car',
      'https://source.unsplash.com/600x600/?dice,gambling'
    ]
  },
  // Health & Personal Care
  {
    category: 'Health & Personal Care',
    urls: [
      'https://source.unsplash.com/600x600/?meditation,mindfulness',
      'https://source.unsplash.com/600x600/?vitamins,supplements',
      'https://source.unsplash.com/600x600/?first-aid,medical',
      'https://source.unsplash.com/600x600/?massage,therapy',
      'https://source.unsplash.com/600x600/?dental,hygiene',
      'https://source.unsplash.com/600x600/?thermometer,temperature',
      'https://source.unsplash.com/600x600/?bandage,injury',
      'https://source.unsplash.com/600x600/?wheelchair,mobility',
      'https://source.unsplash.com/600x600/?stethoscope,doctor',
      'https://source.unsplash.com/600x600/?pill,medicine'
    ]
  },
  // Automotive
  {
    category: 'Automotive',
    urls: [
      'https://source.unsplash.com/600x600/?car,vehicle',
      'https://source.unsplash.com/600x600/?motorcycle,bike',
      'https://source.unsplash.com/600x600/?truck,heavy-duty',
      'https://source.unsplash.com/600x600/?electric-car,ev',
      'https://source.unsplash.com/600x600/?tires,wheels',
      'https://source.unsplash.com/600x600/?engine,motor',
      'https://source.unsplash.com/600x600/?dashboard,interior',
      'https://source.unsplash.com/600x600/?gas-station,fueling',
      'https://source.unsplash.com/600x600/?car-wash,cleaning',
      'https://source.unsplash.com/600x600/?road-trip,journey'
    ]
  },
  // Office Products
  {
    category: 'Office Products',
    urls: [
      'https://source.unsplash.com/600x600/?desk,workspace',
      'https://source.unsplash.com/600x600/?chair,office',
      'https://source.unsplash.com/600x600/?notebook,stationery',
      'https://source.unsplash.com/600x600/?pen,ink',
      'https://source.unsplash.com/600x600/?printer,device',
      'https://source.unsplash.com/600x600/?calculator,math',
      'https://source.unsplash.com/600x600/?paperclip,organizer',
      'https://source.unsplash.com/600x600/?calendar,schedule',
      'https://source.unsplash.com/600x600/?folder,organization',
      'https://source.unsplash.com/600x600/?stapler,office-supply'
    ]
  }
];

// Function to download an image from URL
async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const filePath = path.join(imagesDir, filename);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
    throw error;
  }
}

// Function to download all images
async function downloadAllImages() {
  console.log('Starting to download images...');
  
  for (const source of imageSources) {
    console.log(`Downloading images for category: ${source.category}`);
    
    for (let i = 0; i < source.urls.length; i++) {
      const url = source.urls[i];
      const filename = `${source.category.toLowerCase().replace(/\s+/g, '-')}_${i + 1}.jpg`;
      
      try {
        await downloadImage(url, filename);
        console.log(`Downloaded: ${filename}`);
      } catch (error) {
        console.error(`Failed to download: ${filename}`, error.message);
      }
    }
  }
  
  console.log('Image download completed!');
}

// Export the function for use in other modules
module.exports = { downloadAllImages, imageSources };

// If this file is run directly, execute the download
if (require.main === module) {
  downloadAllImages()
    .then(() => {
      console.log('All images downloaded successfully!');
    })
    .catch(error => {
      console.error('Error downloading images:', error);
    });
}