import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const BASE_SRC = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Women\\ACCESSORİES\\JEWELRY & ACCESSORIES';
const publicWomenDir = path.join(process.cwd(), 'public', 'products', 'women');
const productsTsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

if (!fs.existsSync(publicWomenDir)) {
  fs.mkdirSync(publicWomenDir, { recursive: true });
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
  const folders = [
    { dirName: 'BRACELETS', subCat: 'Bracelets', namePrefix: 'Bracelets' },
    { dirName: 'BROOCHES', subCat: 'Brooches', namePrefix: 'Brooch' },
    { dirName: 'EARRINGS', subCat: 'Earrings', namePrefix: 'Earrings' },
    { dirName: 'NECKLACES AND PENDANTS', subCat: 'Necklaces', namePrefix: 'Necklace' },
    { dirName: 'RİNGS', subCat: 'Rings', namePrefix: 'Ring' }
  ];

  const jewelProducts = [];
  const tasks = [];
  
  let globalIdCounter = 1;
  
  for (const folder of folders) {
    const dirPath = path.join(BASE_SRC, folder.dirName);
    console.log(`Reading jewelry folder: ${folder.dirName}...`);
    const files = getImagesInFolder(dirPath);
    const groups = groupFiles(files);
    console.log(`Found ${groups.length} unique styles in ${folder.dirName}`);
    
    // Select the first 5 unique styles for this category
    const selectedGroups = groups.slice(0, 5);
    
    selectedGroups.forEach((group, groupIdx) => {
      const currentId = globalIdCounter++;
      const subCat = folder.subCat;
      const namePrefix = folder.namePrefix;
      
      tasks.push(async () => {
        const webpImages = [];
        console.log(`Processing ${subCat} style ${groupIdx + 1} (${group.length} angles)...`);
        
        for (let imgIndex = 0; imgIndex < group.length; imgIndex++) {
          const srcFile = group[imgIndex];
          const webpName = `mbl_jewel_g${currentId}_${imgIndex + 1}.webp`;
          const destPath = path.join(publicWomenDir, webpName);
          
          try {
            if (!fs.existsSync(destPath)) {
              await convertToWebp(srcFile, destPath);
            }
            webpImages.push(`/products/women/${webpName}`);
          } catch (err) {
            console.error(`Error converting ${srcFile}:`, err.message);
          }
        }
        
        if (webpImages.length > 0) {
          const price = 120 + (currentId * 15);
          const originalPrice = Math.round(price * 1.3);
          const p = `{
    id: 'MBL-JEWEL-G${String(currentId).padStart(2, '0')}',
    name: 'Exclusive Luxury ${namePrefix} Style ${groupIdx + 1}',
    price: ${price},
    originalPrice: ${originalPrice},
    brand: 'MBL',
    gender: 'women',
    category: 'accessories',
    subCategory: '${subCat}',
    image: '${webpImages[0]}',
    images: ${JSON.stringify(webpImages)},
    code: 'MBL-JW-G${currentId}',
    description: 'A premium luxury designer accessory styled in multiple angles. Swipe/click images to view all details.',
    sizes: ['One Size'],
    isNew: true,
    isSale: false
  }`;
          jewelProducts.push({ id: currentId, code: p });
        }
      });
    });
  }

  // Run image conversion tasks with concurrency of 6
  await runConcurrent(tasks, 6);
  
  // Sort by id numerical value to keep output clean
  jewelProducts.sort((a, b) => a.id - b.id);
  const formattedProducts = jewelProducts.map(p => p.code);

  console.log('Injecting jewelry products into products.ts...');
  let content = fs.readFileSync(productsTsPath, 'utf-8');
  
  // Write the jewelry declarations
  const newDeclaration = `
const groupedJewelry: Product[] = [
  ${formattedProducts.join(',\n  ')}
];
`;

  // Find where export const products is declared to inject before it
  const exportIndex = content.indexOf('export const products');
  if (exportIndex !== -1) {
    content = content.slice(0, exportIndex) + newDeclaration + '\n' + content.slice(exportIndex);
    
    // Add to exported products array
    const productsStart = content.indexOf('export const products: Product[] = [');
    if (productsStart !== -1) {
      const groupedBagsSpreadIndex = content.indexOf('...groupedBags,', productsStart);
      if (groupedBagsSpreadIndex !== -1) {
        const insertPos = groupedBagsSpreadIndex + '...groupedBags,'.length;
        content = content.slice(0, insertPos) + '\n  ...groupedJewelry,' + content.slice(insertPos);
        
        fs.writeFileSync(productsTsPath, content, 'utf-8');
        console.log('Successfully added 25 unique jewelry products to products.ts!');
      } else {
        console.error('Could not find ...groupedBags, inside products array');
      }
    } else {
      console.error('Could not find export const products');
    }
  } else {
    console.error('Could not find export const products in products.ts');
  }
}

run();
