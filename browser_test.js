import puppeteer from 'puppeteer-core';

async function checkCategory(page, categoryName, linkHref) {
  console.log(`\nNavigating to ${categoryName} via click...`);
  
  // Wait for the link to appear and be clickable
  const selector = `a[href="${linkHref}"]`;
  await page.waitForSelector(selector, { visible: true, timeout: 10000 });
  
  // Use page.evaluate to click to avoid "element not interactable" errors if covered
  await page.evaluate((sel) => {
    document.querySelector(sel).click();
  }, selector);
  
  // Wait for network idle to ensure products load
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => {});
  
  // Give framer-motion time to animate in the ProductCards
  await new Promise(r => setTimeout(r, 2000));
  
  const images = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));
  });

  console.log(`Found ${images.length} images on ${categoryName}.`);
  let broken = 0;
  for (const img of images) {
    if (!img.complete || img.naturalWidth === 0) {
      broken++;
      console.log(`⚠️  Broken image on ${categoryName}: ${img.src}`);
    }
  }
  
  console.log(`Broken DOM images on ${categoryName}: ${broken}`);
  
  return broken;
}

(async () => {
  console.log('Launching headless browser (Microsoft Edge) for automated testing...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => {
    pageErrors.push(`Failed to load resource: ${request.url()} - ${request.failure()?.errorText || 'unknown error'}`);
  });

  try {
    const baseUrl = 'https://app-seven-flame-32.vercel.app';
    console.log(`Navigating to homepage: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    await new Promise(r => setTimeout(r, 2000));

    let totalBroken = 0;
    
    const categories = [
      { name: 'Men', href: '/shop/men' },
      { name: 'Women', href: '/shop/women' },
      { name: 'Accessories', href: '/shop/accessories' },
      { name: 'Children', href: '/shop/children' }
    ];

    for (const cat of categories) {
      // Force navigation back to homepage before each click to ensure nav is visible
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 1000));
      totalBroken += await checkCategory(page, cat.name, cat.href);
    }

    console.log('\n--- TEST RESULTS ---');
    if (pageErrors.length > 0) {
      console.log(`Tests finished with ${pageErrors.length} errors:`);
      pageErrors.slice(0, 5).forEach(e => console.log(`❌ ${e}`));
    }
    
    if (totalBroken > 0) {
      console.log(`Tests finished, but found ${totalBroken} broken images.`);
    } else if (pageErrors.length === 0) {
      console.log('✅ All tests passed! Website is working flawlessly. All images loaded correctly across all sections!');
    }
    
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
})();
