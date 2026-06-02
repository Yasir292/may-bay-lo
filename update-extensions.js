import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

function replaceExtensions(content) {
  let newContent = content;
  // Replace .jpg, .jpeg, .png with .webp
  const extensions = ['.jpg', '.jpeg', '.png'];
  for (const ext of extensions) {
    // We match ext followed by quote or bracket
    const regex = new RegExp(`\\${ext}(['"\`\\)])`, 'gi');
    newContent = newContent.replace(regex, `.webp$1`);
  }
  return newContent;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const updated = replaceExtensions(content);
        if (content !== updated) {
          fs.writeFileSync(fullPath, updated, 'utf-8');
          console.log(`Updated extensions in: ${fullPath}`);
        }
      }
    }
  }
}

console.log('Replacing image extensions in source files...');
processDirectory(SRC_DIR);
console.log('Done replacing extensions!');
