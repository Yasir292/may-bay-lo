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
    brand: 'MBL',
    gender: 'men',
    category: 'men',
    subCategory: 'Shoes',
    images: ['/products/mbl_shoe_${i}.webp'],
    description: 'Premium designer footwear combining contemporary aesthetics with ultimate comfort. Crafted with high-quality materials for lasting durability.',
    details: [
      'Premium upper materials',
      'Cushioned insole',
      'Textured grip outsole',
      'Made in Italy'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    isNew: true
  }`;
  newProducts.push(p);
}

const insertionString = `\nconst newShoes: Product[] = [\n  ${newProducts.join(',\n  ')}\n];\n`;

// Insert the newShoes array definition before the main products array
const exportProductsIndex = content.indexOf('export const products: Product[] = [');
if (exportProductsIndex !== -1) {
  content = content.slice(0, exportProductsIndex) + insertionString + content.slice(exportProductsIndex);
  
  // Now add ...newShoes, to the main products array
  const childrenIndex = content.indexOf('...childrenProducts,');
  if (childrenIndex !== -1) {
    content = content.slice(0, childrenIndex + '...childrenProducts,'.length) + '\n  ...newShoes,' + content.slice(childrenIndex + '...childrenProducts,'.length);
    fs.writeFileSync(productsPath, content, 'utf-8');
    console.log('Successfully injected 25 new shoe products into products.ts');
  } else {
    console.error('Could not find ...childrenProducts, to inject the new array');
  }
} else {
  console.error('Could not find export const products');
}
