import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const SHOES_SRC = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Men\\SHOES & TRAINERS&SLIDERS\\SHOES';
const BAGS_SRC = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Women\\BAGS';

const publicMenDir = path.join(process.cwd(), 'public', 'products', 'men');
const publicWomenDir = path.join(process.cwd(), 'public', 'products', 'women');
const productsTsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

// Create directories if not exist
fs.mkdirSync(publicMenDir, { recursive: true });
fs.mkdirSync(publicWomenDir, { recursive: true });

// Helper to get all image files in a folder (non-recursive)
function getImagesInFolder(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(f => f.match(/\.(jpg|jpeg|png|heic)$/i))
    .map(f => path.join(dirPath, f));
}

// Helper to recursively get all leaf directories containing images
function getLeafDirs(dirPath, leafDirs = []) {
  const files = fs.readdirSync(dirPath);
  let hasSubdirs = false;
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      hasSubdirs = true;
      getLeafDirs(fullPath, leafDirs);
    }
  }
  
  if (!hasSubdirs || getImagesInFolder(dirPath).length > 0) {
    leafDirs.push(dirPath);
  }
  return leafDirs;
}

// Heuristic to group files in a folder into blocks of up to 4 angles
function groupFiles(files) {
  const groups = [];
  let currentGroup = [];
  let lastNum = null;
  
  // Sort files numerically by number in filename
  const sortedFiles = [...files].sort((a, b) => {
    const numA = parseInt(path.basename(a).match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(path.basename(b).match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });
  
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

// Convert image buffer to WebP
async function convertToWebp(filePath, destPath) {
  const inputBuffer = fs.readFileSync(filePath);
  let jpegBuffer = inputBuffer;
  
  // Check if it's HEIC masking as JPG
  if (inputBuffer.length > 4 && inputBuffer.toString('ascii', 4, 12).includes('ftyp')) {
    jpegBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    });
  }
  
  await sharp(jpegBuffer)
    .webp({ quality: 80 })
    .toFile(destPath);
}

async function run() {
  console.log('1. Grouping Men\'s Shoes...');
  const shoeFiles = getImagesInFolder(SHOES_SRC);
  const rawShoeGroups = groupFiles(shoeFiles);
  console.log(`Found ${rawShoeGroups.length} unique shoe styles (groups) in total.`);
  
  // Process the first 25 unique shoe styles
  const selectedShoeGroups = rawShoeGroups.slice(0, 25);
  const shoeProducts = [];
  
  for (let gIndex = 0; gIndex < selectedShoeGroups.length; gIndex++) {
    const group = selectedShoeGroups[gIndex];
    const shoeIdNum = gIndex + 1;
    const webpImages = [];
    
    console.log(`Processing Shoe Group ${shoeIdNum} (${group.length} angles)...`);
    
    for (let imgIndex = 0; imgIndex < group.length; imgIndex++) {
      const srcFile = group[imgIndex];
      const webpName = `mbl_shoe_g${shoeIdNum}_${imgIndex + 1}.webp`;
      const destPath = path.join(publicMenDir, webpName);
      
      try {
        if (!fs.existsSync(destPath)) {
          await convertToWebp(srcFile, destPath);
        } else {
          console.log(`Using cached ${webpName}`);
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
  }
  
  console.log('2. Grouping Women\'s Bags...');
  const leafDirs = getLeafDirs(BAGS_SRC);
  const rawBagGroups = [];
  
  for (const dir of leafDirs) {
    const files = getImagesInFolder(dir);
    if (files.length > 0) {
      const dirGroups = groupFiles(files);
      rawBagGroups.push(...dirGroups);
    }
  }
  console.log(`Found ${rawBagGroups.length} unique bag styles (groups) in total.`);
  
  // Process the first 25 unique bag styles
  const selectedBagGroups = rawBagGroups.slice(0, 25);
  const bagProducts = [];
  
  for (let gIndex = 0; gIndex < selectedBagGroups.length; gIndex++) {
    const group = selectedBagGroups[gIndex];
    const bagIdNum = gIndex + 1;
    const webpImages = [];
    
    console.log(`Processing Bag Group ${bagIdNum} (${group.length} angles)...`);
    
    for (let imgIndex = 0; imgIndex < group.length; imgIndex++) {
      const srcFile = group[imgIndex];
      const webpName = `mbl_bag_g${bagIdNum}_${imgIndex + 1}.webp`;
      const destPath = path.join(publicWomenDir, webpName);
      
      try {
        if (!fs.existsSync(destPath)) {
          await convertToWebp(srcFile, destPath);
        } else {
          console.log(`Using cached ${webpName}`);
        }
        webpImages.push(`/products/women/${webpName}`);
      } catch (err) {
        console.error(`Error converting ${srcFile}:`, err.message);
      }
    }
    
    if (webpImages.length > 0) {
      // Try to determine brand from path
      let brand = 'MBL';
      const pathParts = group[0].split(path.sep);
      const handbagsIndex = pathParts.indexOf('HANDBAGS');
      if (handbagsIndex !== -1 && pathParts.length > handbagsIndex + 1) {
        brand = pathParts[handbagsIndex + 1];
      }
      
      const p = `{
    id: 'MBL-BAG-G${String(bagIdNum).padStart(2, '0')}',
    name: 'Exclusive ${brand} Designer Bag ${bagIdNum}',
    price: ${680 + (bagIdNum * 25)},
    originalPrice: ${880 + (bagIdNum * 30)},
    brand: '${brand}',
    gender: 'women',
    category: 'accessories',
    subCategory: 'Bags',
    image: '${webpImages[0]}',
    images: ${JSON.stringify(webpImages)},
    code: 'MBL-BG-G${bagIdNum}',
    description: 'A premium luxury designer bag styled in multiple angles. Swipe/click images to view all details.',
    sizes: ['One Size'],
    isNew: true,
    isSale: false
  }`;
      bagProducts.push(p);
    }
  }
  
  // 3. Inject into products.ts
  console.log('3. Injecting into products.ts...');
  let content = fs.readFileSync(productsTsPath, 'utf-8');
  
  // Remove existing injected declarations: newShoes, newBags, newShoesMore
  const removePatterns = [
    /const newShoes:\s*Product\[\]\s*=\s*\[[\s\S]*?\];?\n/g,
    /const newBags:\s*Product\[\]\s*=\s*\[[\s\S]*?\];?\n/g,
    /const newShoesMore:\s*Product\[\]\s*=\s*\[[\s\S]*?\];?\n/g
  ];
  for (const pat of removePatterns) {
    content = content.replace(pat, '');
  }
  
  // Write the new declarations
  const newDeclarations = `
const groupedShoes: Product[] = [
  ${shoeProducts.join(',\n  ')}
];

const groupedBags: Product[] = [
  ${bagProducts.join(',\n  ')}
];
`;
  
  // Insert declarations before products array
  const exportStart = content.indexOf('export const products: Product[] = [');
  if (exportStart !== -1) {
    content = content.slice(0, exportStart) + newDeclarations + content.slice(exportStart);
    
    // Find the end of products array and replace the spread items
    const productsEnd = content.indexOf(']', content.indexOf('export const products: Product[] = ['));
    if (productsEnd !== -1) {
      const match = content.match(/export const products:\s*Product\[\]\s*=\s*\[([\s\S]*?)\]/);
      if (match) {
        const productsArrayContent = `
  ...groupedShoes,
  ...groupedBags,
  ...menProducts,
  ...womenProducts,
  ...accessoriesProducts,
  ...childrenProducts,
`;
        content = content.replace(/export const products:\s*Product\[\]\s*=\s*\[([\s\S]*?)\]/, `export const products: Product[] = [${productsArrayContent}]`);
      }
    }
  }
  
  fs.writeFileSync(productsTsPath, content, 'utf-8');
  console.log('Successfully completed grouping, converting, and injecting into products.ts!');
}

run();
