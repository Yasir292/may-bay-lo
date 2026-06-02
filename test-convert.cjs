const fs = require('fs');
const heicConvert = require('heic-convert');
const sharp = require('sharp');

const file = "E:\\Antigerverty\\MAY BAY LO\\catalog_download\\Men\\SHOES & TRAINERS&SLIDERS\\SHOES\\IMG_0001.jpg";

async function test() {
  console.log("Reading file...");
  const buf = fs.readFileSync(file);
  console.log("Size:", buf.length);
  console.log("ftyp check:", buf.toString('ascii', 4, 12));
  
  if (buf.length > 4 && buf.toString('ascii', 4, 12).includes('ftyp')) {
    console.log("HEIC detected. Converting...");
    try {
      const jpeg = await heicConvert({
        buffer: buf,
        format: 'JPEG',
        quality: 1
      });
      console.log("HEIC converted. Size:", jpeg.length);
      await sharp(jpeg).webp().toFile("test-output.webp");
      console.log("WebP saved.");
    } catch (e) {
      console.error("HEIC conversion failed:", e.message);
    }
  } else {
    console.log("Not HEIC. Sharp converting...");
    await sharp(buf).webp().toFile("test-output.webp");
    console.log("WebP saved.");
  }
}

test();
