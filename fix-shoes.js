import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import heicConvert from 'heic-convert';
import sharp from 'sharp';

const PUBLIC_PRODUCTS = path.join(process.cwd(), 'public', 'products');

async function fixShoes() {
  console.log('Fixing the 25 shoe images that are secretly HEIC...');
  for (let i = 1; i <= 25; i++) {
    const filename = `mbl_shoe_${i}.jpg`;
    const fullPath = path.join(PUBLIC_PRODUCTS, filename);
    const webpPath = path.join(PUBLIC_PRODUCTS, `mbl_shoe_${i}.webp`);
    
    if (fs.existsSync(fullPath)) {
      try {
        const inputBuffer = fs.readFileSync(fullPath);
        
        // Convert HEIC to JPEG buffer
        console.log(`Converting ${filename} from HEIC to JPEG buffer...`);
        const jpegBuffer = await heicConvert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 1
        });
        
        // Convert JPEG buffer to WebP
        console.log(`Optimizing ${filename} to WebP...`);
        await sharp(jpegBuffer)
          .webp({ quality: 80, effort: 6 })
          .toFile(webpPath);
          
        fs.unlinkSync(fullPath);
        console.log(`Success for mbl_shoe_${i}`);
      } catch (err) {
        console.error(`Failed to process ${filename}:`, err);
      }
    }
  }
}

fixShoes().catch(console.error);
