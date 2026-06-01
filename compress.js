import fs from 'fs';
import path from 'path';
import convert from 'heic-convert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'public', 'products', 'men');

async function processImages() {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('MENS_SHOE_') && f.endsWith('.jpg'));
  
  console.log(`Found ${files.length} images to process...`);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    try {
      // First read the file
      const inputBuffer = fs.readFileSync(filePath);
      
      // If it's HEIC, the first few bytes have "ftypheic" or "ftypmif1" or similar
      const isHeic = inputBuffer.includes(Buffer.from('ftypheic')) || 
                     inputBuffer.includes(Buffer.from('ftypmif1')) ||
                     inputBuffer.includes(Buffer.from('ftypheix'));
                     
      if (isHeic) {
        console.log(`Converting HEIC to JPEG: ${file}`);
        const outputBuffer = await convert({
          buffer: inputBuffer, // the HEIC file buffer
          format: 'JPEG',      // output format
          quality: 0.7         // the jpeg compression quality, between 0 and 1
        });
        
        fs.writeFileSync(filePath, Buffer.from(outputBuffer));
        console.log(`Successfully converted ${file}`);
      } else {
        // console.log(`Already a proper image (or not HEIC): ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  
  console.log('Finished processing.');
}

processImages();
