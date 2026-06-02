import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const SHOES_SRC = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Men\\SHOES & TRAINERS&SLIDERS\\SHOES';
const destDir = path.join(process.cwd(), 'public', 'products', 'men');
const productsTsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function processShoes() {
  // 1. Get the NEXT 25 files (skipping the first 25 used previously)
  const allFiles = fs.readdirSync(SHOES_SRC)
    .filter(f => f.match(/\.(jpg|jpeg|png|heic)$/i));
    
  const files = allFiles.slice(25, 50).map(f => path.join(SHOES_SRC, f));
  
  console.log(`Found ${files.length} new unique shoes to process.`);

  // 2. Convert and save
  const newProducts = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const shoeNum = i + 26; // Start from 26
    const webpName = `mbl_shoe_${shoeNum}.webp`;
    const destPath = path.join(destDir, webpName);
    
    try {
      const inputBuffer = fs.readFileSync(file);
      let jpegBuffer = inputBuffer;
      
      // Check if it's HEIC masking as JPG
      if (inputBuffer.length > 4 && inputBuffer.toString('ascii', 4, 12).includes('ftyp')) {
        console.log(`Converting ${path.basename(file)} from HEIC...`);
        jpegBuffer = await heicConvert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 1
        });
      }
      
      console.log(`Optimizing ${webpName} to WebP...`);
      await sharp(jpegBuffer)
        .webp({ quality: 80 })
        .toFile(destPath);
        
      console.log(`Success for ${webpName}`);
      
      // Create product entry
      const p = `{
    id: 'MBL-SHOE3-${String(shoeNum).padStart(2, '0')}',
    name: 'Exclusive Designer Shoe ${shoeNum}',
    price: ${350 + (shoeNum * 5)},
    originalPrice: ${450 + (shoeNum * 7)},
    brand: 'MBL',
    gender: 'men',
    category: 'men',
    subCategory: 'Shoes',
    image: '/products/men/${webpName}',
    images: ['/products/men/${webpName}'],
    code: 'MBL-SH3-${shoeNum}',
    description: 'A completely unique, never-before-seen premium designer footwear. Unmatched style and absolute comfort.',
    sizes: ['7', '8', '9', '10', '11'],
    isNew: true,
    isSale: false
  }`;
      newProducts.push(p);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  // 3. Inject into products.ts
  let content = fs.readFileSync(productsTsPath, 'utf-8');
  const insertionString = `\nconst newShoesMore: Product[] = [\n  ${newProducts.join(',\n  ')}\n];\n`;
  
  const start = content.indexOf('export const products: Product[] = [');
  if (start !== -1) {
    content = content.slice(0, start) + insertionString + content.slice(start);
    
    // Add to the exported array
    const exportEnd = content.indexOf(']', start + insertionString.length);
    if (exportEnd !== -1) {
      const beforeClose = content.slice(0, exportEnd);
      let updatedExport = beforeClose;
      if (!updatedExport.endsWith('\n')) updatedExport += '\n';
      updatedExport += '  ...newShoesMore,\n';
      content = updatedExport + content.slice(exportEnd);
      
      fs.writeFileSync(productsTsPath, content, 'utf-8');
      console.log('Successfully injected 25 more unique shoe products into products.ts');
    }
  } else {
    console.error('Could not find export const products');
  }
}

processShoes();
