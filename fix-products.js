import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

let content = fs.readFileSync(productsPath, 'utf-8');

const newProducts = [];
for (let i = 1; i <= 25; i++) {
  const p = `{
    id: 'MBL-SHOE2-${String(i).padStart(2, '0')}',
    name: 'Designer Trainers ${i}',
    price: ${350 + (i * 10)},
    originalPrice: ${400 + (i * 10)},
    brand: 'MBL',
    gender: 'men',
    category: 'men',
    subCategory: 'Shoes',
    image: '/products/mbl_shoe_${i}.webp',
    images: ['/products/mbl_shoe_${i}.webp'],
    code: 'MBL-SH-${i}',
    description: 'Premium designer footwear combining contemporary aesthetics with ultimate comfort. Crafted with high-quality materials for lasting durability.',
    sizes: ['7', '8', '9', '10', '11'],
    isNew: true,
    isSale: false
  }`;
  newProducts.push(p);
}

const insertionString = `\nconst newShoes: Product[] = [\n  ${newProducts.join(',\n  ')}\n];\n`;

// Find the existing newShoes definition
const start = content.indexOf('const newShoes: Product[] = [');
if (start !== -1) {
  let end = content.indexOf('];', start);
  if (end !== -1) {
    end += 2; // include ];
    content = content.slice(0, start) + insertionString.trim() + content.slice(end);
    fs.writeFileSync(productsPath, content, 'utf-8');
    console.log('Fixed newShoes array in products.ts');
  }
} else {
  console.log("Could not find newShoes array");
}
