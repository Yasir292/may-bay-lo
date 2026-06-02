import fs from 'fs';
import path from 'path';
import https from 'https';

const SHOES_SRC = 'E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Men\\SHOES & TRAINERS&SLIDERS\\SHOES';
const PUBLIC_PRODUCTS = path.join(process.cwd(), 'public', 'products');

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Copying 25 shoe images...');
  
  if (!fs.existsSync(PUBLIC_PRODUCTS)) {
    fs.mkdirSync(PUBLIC_PRODUCTS, { recursive: true });
  }

  const files = fs.readdirSync(SHOES_SRC)
    .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png'))
    .slice(0, 25);
    
  for (let i = 0; i < files.length; i++) {
    const srcPath = path.join(SHOES_SRC, files[i]);
    const destPath = path.join(PUBLIC_PRODUCTS, `mbl_shoe_${i + 1}.jpg`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${files[i]} -> mbl_shoe_${i + 1}.jpg`);
  }
  
  console.log('Downloading placeholder images for Curated Wardrobes...');
  
  // Loungewear
  await downloadImage('https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', path.join(PUBLIC_PRODUCTS, 'loungewear.jpg'));
  console.log('Downloaded loungewear.jpg');
  
  // Activewear
  await downloadImage('https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', path.join(PUBLIC_PRODUCTS, 'activewear.jpg'));
  console.log('Downloaded activewear.jpg');
  
  // Formalwear
  await downloadImage('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', path.join(PUBLIC_PRODUCTS, 'formalwear.jpg'));
  console.log('Downloaded formalwear.jpg');
  
  console.log('Setup complete!');
}

run().catch(console.error);
