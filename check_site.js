import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://app-seven-flame-32.vercel.app';

// Images we expect to be deployed based on the local folder
const expectedImages = [
  ...Array.from({ length: 27 }, (_, i) => `MENS_SHOE_${i + 1}_1.jpg`),
  ...Array.from({ length: 27 }, (_, i) => `MENS_SHOE_${i + 1}_2.jpg`),
  ...Array.from({ length: 27 }, (_, i) => `MENS_SHOE_${i + 1}_3.jpg`),
  ...Array.from({ length: 27 }, (_, i) => `MENS_SHOE_${i + 1}_4.jpg`)
].map(img => `/products/men/${img}`);

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    }).end();
  });
}

async function analyze() {
  console.log('Testing connection to main website...');
  const mainSite = await checkUrl(baseUrl + '/');
  console.log(`Main Site (/): ${mainSite.status}`);

  console.log(`\nChecking ${expectedImages.length} images...`);
  
  // Check a batch of 20 random images to ensure they are deployed correctly
  const sample = expectedImages.sort(() => 0.5 - Math.random()).slice(0, 20);
  
  let successCount = 0;
  for (const imgPath of sample) {
    const fullUrl = baseUrl + imgPath;
    const result = await checkUrl(fullUrl);
    if (result.status === 200) {
      successCount++;
    } else {
      console.log(`FAILED: ${imgPath} returned ${result.status}`);
    }
  }
  
  console.log(`\nImage Check Results: ${successCount} out of ${sample.length} sampled images loaded perfectly with 200 OK.`);
  
  if (successCount === sample.length) {
    console.log('SUCCESS: Images are properly deployed and publicly accessible!');
  }
}

analyze();
