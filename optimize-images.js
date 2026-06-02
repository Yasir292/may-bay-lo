import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        try {
          const newPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
          
          console.log(`Optimizing: ${entry.name} -> .webp`);
          await sharp(fullPath)
            .webp({ quality: 80, effort: 6 })
            .toFile(newPath);

          // Verify the new file exists and has size > 0
          const stats = fs.statSync(newPath);
          if (stats.size > 0) {
            fs.unlinkSync(fullPath); // Delete the original
            console.log(`Deleted original: ${entry.name}`);
          } else {
            console.error(`Failed to convert ${entry.name} (zero bytes)`);
          }
        } catch (err) {
          console.error(`Error processing ${fullPath}:`, err);
        }
      }
    }
  }
}

console.log('Starting WebP conversion for all images in public directory...');
processDirectory(PUBLIC_DIR)
  .then(() => console.log('Image conversion complete!'))
  .catch(console.error);
