import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const srcDir = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Women\\BAGS';
const destDir = path.join(process.cwd(), 'public', 'products', 'women');
const productsTsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const p = path.join(dirPath, file);
    if (fs.statSync(p).isDirectory()) {
      arrayOfFiles = getAllFiles(p, arrayOfFiles);
    } else {
      arrayOfFiles.push(p);
    }
  });

  return arrayOfFiles;
}

async function processBags() {
  // 1. Get 25 files recursively
  let files = getAllFiles(srcDir);
  files = files.filter(f => f.match(/\.(jpg|jpeg|heic)$/i)).slice(0, 25);
  
  console.log(`Found ${files.length} images to process.`);

  // 2. Convert and save
  const newProducts = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bagNum = i + 1;
    const webpName = `mbl_bag_${bagNum}.webp`;
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
    id: 'MBL-BAG-${String(bagNum).padStart(2, '0')}',
    name: 'Luxury Designer Bag ${bagNum}',
    price: ${850 + (bagNum * 15)},
    originalPrice: ${1000 + (bagNum * 20)},
    brand: 'MBL',
    gender: 'women',
    category: 'accessories',
    subCategory: 'Bags',
    image: '/products/women/${webpName}',
    images: ['/products/women/${webpName}'],
    code: 'MBL-B-${bagNum}',
    description: 'Exquisite luxury bag crafted from premium materials. Perfect for elevating any ensemble with contemporary elegance.',
    sizes: ['One Size'],
    isNew: true,
    isSale: false
  }`;
      newProducts.push(p);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  // 3. Inject into products.ts (replacing the previous flawed newBags array)
  let content = fs.readFileSync(productsTsPath, 'utf-8');
  const insertionString = `\nconst newBags: Product[] = [\n  ${newProducts.join(',\n  ')}\n];\n`;
  
  const start = content.indexOf('const newBags: Product[] = [');
  if (start !== -1) {
    let end = content.indexOf('];', start);
    if (end !== -1) {
      end += 2;
      content = content.slice(0, start) + insertionString.trim() + '\n' + content.slice(end);
      fs.writeFileSync(productsTsPath, content, 'utf-8');
      console.log('Successfully fixed and injected 25 new bag products into products.ts');
    }
  } else {
    console.error('Could not find newBags array');
  }
}

processBags();
