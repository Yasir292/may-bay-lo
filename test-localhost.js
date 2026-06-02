import puppeteer from 'puppeteer-core';

(async () => {
  console.log('Testing localhost preview...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });
  
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => {
    pageErrors.push(`Failed to load resource: ${request.url()} - ${request.failure()?.errorText || 'unknown error'}`);
  });
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  try {
    const baseUrl = 'http://localhost:4173';
    console.log(`Navigating to ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    
    // Check images
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      }));
    });
    
    console.log(`Homepage has ${images.length} images.`);
    for (const img of images) {
      if (!img.complete || img.naturalWidth === 0) {
        console.log(`Broken image on Homepage: ${img.src}`);
      }
    }

    // Go to Men's Shop
    await page.goto(`${baseUrl}/shop/men`, { waitUntil: 'networkidle0' });
    const menImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      }));
    });
    console.log(`Men's page has ${menImages.length} images.`);
    for (const img of menImages) {
      if (!img.complete || img.naturalWidth === 0) {
        console.log(`Broken image on Men's page: ${img.src}`);
      }
    }

    if (pageErrors.length > 0) {
      console.log('Page Errors:', pageErrors);
    } else {
      console.log('No page errors detected.');
    }
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
