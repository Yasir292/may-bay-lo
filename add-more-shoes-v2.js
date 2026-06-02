import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const SHOES_SRC = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Men\\SHOES & TRAINERS&SLIDERS\\SHOES';
const publicMenDir = path.join(process.cwd(), 'public', 'products', 'men');
const productsTsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

if (!fs.existsSync(publicMenDir)) {
  fs.mkdirSync(publicMenDir, { recursive: true });
}

function getImagesInFolder(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(f => f.match(/\.(jpg|jpeg|png|heic)$/i))
    .map(f => path.join(dirPath, f));
}

function groupFiles(files) {
  const sortedFiles = [...files].sort((a, b) => {
    const numA = parseInt(path.basename(a).match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(path.basename(b).match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });
  
  const groups = [];
  let currentGroup = [];
  let lastNum = null;
  
  for (const file of sortedFiles) {
    const num = parseInt(path.basename(file).match(/\d+/)?.[0] || '0', 10);
    const isConsecutive = lastNum === null || (num - lastNum <= 1);
    const isUnderCap = currentGroup.length < 4;
    
    if (isConsecutive && isUnderCap) {
      currentGroup.push(file);
    } else {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [file];
    }
    lastNum = num;
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups;
}

async function convertToWebp(filePath, destPath) {
  const inputBuffer = fs.readFileSync(filePath);
  let jpegBuffer = inputBuffer;
  
  if (inputBuffer.length > 4 && inputBuffer.toString('ascii', 4, 12).includes('ftyp')) {
    jpegBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    });
  }
  
  // Resize to max 1000px on either side to optimize conversion speed and file size
  await sharp(jpegBuffer)
    .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(destPath);
}

async function runConcurrent(tasks, concurrency) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

async function run() {
  console.log('Grouping Men\'s Shoes...');
  const shoeFiles = getImagesInFolder(SHOES_SRC);
  const rawShoeGroups = groupFiles(shoeFiles);
  console.log(`Found ${rawShoeGroups.length} unique shoe styles in total.`);
  
  // Select the next 25 unique shoe styles (index 25 to 50)
  const selectedShoeGroups = rawShoeGroups.slice(25, 50);
  const shoeProducts = [];
  
  const tasks = selectedShoeGroups.map((group, gIndex) => async () => {
    const shoeIdNum = gIndex + 26; // Start from 26
    const webpImages = [];
    
    console.log(`Processing Shoe Group ${shoeIdNum} (${group.length} angles)...`);
    
    for (let imgIndex = 0; imgIndex < group.length; imgIndex++) {
      const srcFile = group[imgIndex];
      const webpName = `mbl_shoe_g${shoeIdNum}_${imgIndex + 1}.webp`;
      const destPath = path.join(publicMenDir, webpName);
      
      try {
        if (!fs.existsSync(destPath)) {
          await convertToWebp(srcFile, destPath);
        }
        webpImages.push(`/products/men/${webpName}`);
      } catch (err) {
        console.error(`Error converting ${srcFile}:`, err.message);
      }
    }
    
    if (webpImages.length > 0) {
      const p = `{
    id: 'MBL-SHOE-G${String(shoeIdNum).padStart(2, '0')}',
    name: 'Exclusive Luxury Shoe Style ${shoeIdNum}',
    price: ${280 + (shoeIdNum * 12)},
    originalPrice: ${380 + (shoeIdNum * 15)},
    brand: 'MBL',
    gender: 'men',
    category: 'men',
    subCategory: 'Shoes',
    image: '${webpImages[0]}',
    images: ${JSON.stringify(webpImages)},
    code: 'MBL-SH-G${shoeIdNum}',
    description: 'A premium designer footwear styled in multiple angles. Swipe/click images to view all details.',
    sizes: ['7', '8', '9', '10', '11'],
    isNew: true,
    isSale: false
  }`;
      shoeProducts.push(p);
    }
  });

  // Run up to 6 image style groups in parallel
  await runConcurrent(tasks, 6);
  
  // Inject into products.ts
  console.log('Injecting into products.ts...');
  let content = fs.readFileSync(productsTsPath, 'utf-8');
  
  // Sort shoeProducts to ensure they are added in correct numerical order
  shoeProducts.sort((a, b) => {
    const idA = a.match(/id:\s*'MBL-SHOE-G(\d+)'/)[1];
    const idB = b.match(/id:\s*'MBL-SHOE-G(\d+)'/)[1];
    return parseInt(idA) - parseInt(idB);
  });

  // Create declaration
  const newDeclaration = `
const groupedShoesMore: Product[] = [
  ${shoeProducts.join(',\n  ')}
];
`;
  
  const groupedBagsIndex = content.indexOf('const groupedBags');
  if (groupedBagsIndex !== -1) {
    content = content.slice(0, groupedBagsIndex) + newDeclaration + '\n' + content.slice(groupedBagsIndex);
    
    // Add to exported products array
    const productsStart = content.indexOf('export const products: Product[] = [');
    if (productsStart !== -1) {
      const groupedShoesIndex = content.indexOf('...groupedShoes,', productsStart);
      if (groupedShoesIndex !== -1) {
        const insertPos = groupedShoesIndex + '...groupedShoes,'.length;
        content = content.slice(0, insertPos) + '\n  ...groupedShoesMore,' + content.slice(insertPos);
        
        fs.writeFileSync(productsTsPath, content, 'utf-8');
        console.log('Successfully added 25 more unique shoe products to products.ts!');
      } else {
        console.error('Could not find ...groupedShoes, inside products array');
      }
    } else {
      console.error('Could not find export const products');
    }
  } else {
    console.error('Could not find const groupedBags in products.ts');
  }
}

run();
