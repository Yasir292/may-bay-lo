const fs = require('fs');
let c = fs.readFileSync('src/data/products.ts', 'utf8');
c = c.replace(/export const products: Product\[\s*\.\.\.newShoesMore,\s*\] = \[/, 'export const products: Product[] = [\n  ...newShoesMore,');
fs.writeFileSync('src/data/products.ts', c);
