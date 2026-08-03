import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to builder...');
  await page.goto('http://localhost:3001/host/builder', { waitUntil: 'networkidle0' });
  
  console.log('Filling form...');
  await page.type('input[placeholder="e.g. Casa Amarela"]', 'Test Property');
  await page.type('input[placeholder="e.g. Alfama, Lisbon"]', 'Lisbon');
  
  console.log('Clicking generate...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Generate My Boutique Website')) {
      await b.click();
      break;
    }
  }
  
  console.log('Waiting 5s...');
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Done.');
  await browser.close();
  process.exit(0);
})();
