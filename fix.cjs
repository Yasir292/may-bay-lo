const fs = require('fs');
let c = fs.readFileSync('src/data/products.ts', 'utf8');
c = c.replace(/export const products: Product\[\s*\.\.\.newBags,\s*\] = \[/, 'export const products: Product[] = [\n  ...newBags,');
fs.writeFileSync('src/data/products.ts', c);
