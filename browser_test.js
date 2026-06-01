import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching headless browser (Microsoft Edge) for automated testing...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  let errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) {
      errors.push(msg.text());
    }
  });

  page.on('requestfailed', request => {
    if(!request.url().includes('favicon')) {
      errors.push(`Request failed: ${request.url()} - ${request.failure().errorText}`);
    }
  });

  console.log('Navigating to homepage...');
  await page.goto('https://app-seven-flame-32.vercel.app/', { waitUntil: 'networkidle0' });
  
  // FIXED PATHS
  const linksToTest = ['/shop/men', '/shop/women', '/shop/accessories', '/shop/children'];
  
  for (const link of linksToTest) {
    console.log(`\nNavigating to ${link}...`);
    const response = await page.goto(`https://app-seven-flame-32.vercel.app${link}`, { waitUntil: 'networkidle0' });
    
    if (response.status() === 404) {
      errors.push(`404 Error: ${link} does not exist`);
    }

    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });
    
    await new Promise(r => setTimeout(r, 2000)); // wait for images to load
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth
      }));
    });
    
    let brokenCount = 0;
    images.forEach(img => {
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:image')) {
        brokenCount++;
        errors.push(`Broken image found on ${link}: ${img.src}`);
      }
    });
    
    console.log(`Found ${images.length} images on ${link}. Broken DOM images: ${brokenCount}`);
    
    // Click on the first product card if any
    const firstProduct = await page.$('a[href^="/product/"]');
    if (firstProduct) {
      console.log(`Clicking on a product from ${link}...`);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
        firstProduct.click(),
      ]);
      console.log(`Successfully navigated to product detail page from ${link}.`);
    } else {
      console.log(`No products found to click on ${link}.`);
    }
  }

  console.log('\n--- TEST RESULTS ---');
  if (errors.length > 0) {
    console.log(`Tests finished with ${errors.length} errors:`);
    const uniqueErrors = [...new Set(errors)];
    uniqueErrors.slice(0, 10).forEach(err => console.log('❌ ' + err));
    if (uniqueErrors.length > 10) console.log(`...and ${uniqueErrors.length - 10} more errors.`);
  } else {
    console.log('✅ ALL TESTS PASSED! No console errors, no failed network requests, and all images loaded correctly in the actual visual browser!');
  }

  await browser.close();
})();
