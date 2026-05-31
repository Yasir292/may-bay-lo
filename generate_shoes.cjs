const fs = require('fs');
const path = require('path');

const srcDir = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Men\\SHOES & TRAINERS&SLIDERS\\SHOES';
const destDir = 'E:\\Antigerverty\\MAY BAY LO\\extracted\\app\\public\\products\\men';
const productsFile = 'E:\\Antigerverty\\MAY BAY LO\\extracted\\app\\src\\data\\products.ts';

// Get all images
const allImages = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.jpg'));

// Group into chunks of 4
const chunks = [];
for (let i = 0; i < allImages.length; i += 4) {
  if (chunks.length < 25) { // generate exactly 25
    chunks.push(allImages.slice(i, i + 4));
  }
}

let newProductsStr = '';

chunks.forEach((chunk, index) => {
  const shoeIndex = index + 3; // start from 3, since we already have 1 and 2
  const shoeId = `NEW-SHOE-${shoeIndex}`;
  const imagesForProduct = [];
  
  chunk.forEach((img, imgIndex) => {
    const destName = `MENS_SHOE_${shoeIndex}_${imgIndex + 1}.jpg`;
    fs.copyFileSync(path.join(srcDir, img), path.join(destDir, destName));
    imagesForProduct.push(`/products/men/${destName}`);
  });

  const price = 110 + Math.floor(Math.random() * 80);
  const origPrice = price + 30 + Math.floor(Math.random() * 50);

  const productObj = `
  {
    id: '${shoeId}',
    name: 'Exclusive Men\\'s Shoe ${shoeIndex}',
    brand: 'May Bay Lo Exclusive',
    price: ${price},
    originalPrice: ${origPrice},
    image: '${imagesForProduct[0]}',
    images: [
      ${imagesForProduct.map(img => `'${img}'`).join(',\n      ')}
    ],
    category: 'men',
    subCategory: 'Shoes',
    code: 'SHOE-00${shoeIndex}',
    description: 'A premium addition to your footwear collection. These exclusive shoes feature modern design, outstanding comfort, and versatile styling.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    isNew: true,
    isSale: ${Math.random() > 0.5 ? 'true' : 'false'},
    gender: 'men',
  },`;
  newProductsStr += productObj;
});

let content = fs.readFileSync(productsFile, 'utf8');
const insertionPoint = 'const menProducts: Product[] = [';
content = content.replace(insertionPoint, insertionPoint + newProductsStr);

fs.writeFileSync(productsFile, content);
console.log('Successfully generated 25 shoe products!');
