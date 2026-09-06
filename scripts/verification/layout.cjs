/* Run against a local dev server. Browser tooling is deliberately external to the app.
   PLAYWRIGHT_MODULE_PATH=/path/to/playwright node scripts/verification/layout.cjs */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const baseURL = process.env.BASE_URL || 'http://localhost:3001';
const output = process.env.OUTPUT_DIR || '/tmp/urmc-zoom/after';
const routes = ['', 'leadership', 'getting-involved', 'ta-directory', 'points', 'events', 'sponsors', 'about-us', 'leaderboard'];
const widths = [320, 351, 352, 390, 767, 768, 769, 900, 901, 1024, 1100, 1101, 1200, 1280, 1300, 1301, 1440, 1600, 1601, 1920, 2560];
const sampleMembers = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, netid: `test${i}`, first_name: i === 0 ? 'Alexandria' : `Member ${i + 1}`,
  last_name: i === 0 ? 'Montgomery-Washington' : 'Example',
  position: i < 3 ? 'Faculty Advisor' : i === 3 ? 'President' : 'Community Building Chair',
  role: i < 3 ? ['advisor', 'ta'] : ['eboard', 'ta'],
  course: i % 2 ? ['INFO 1200', 'CS 2110'] : ['ECE 2300'],
  headshot_url: `${baseURL}/logo192.png`, secondary_headshot_url: `${baseURL}/logo192.png`,
  major: 'Computer Science and Information Science',
  ask_about: ['Mentorship', 'A long topic that should wrap without clipping'],
  bio: 'A long member biography for checking scrollable details. '.repeat(20),
  points_tracking: [{ points: 8, semester: 'fa26' }],
}));
async function fixtures(page, mode = 'success') {
  await page.route('**/rest/v1/**', async route => {
    if (mode === 'error') return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Test service unavailable' }) });
    const url = new URL(route.request().url());
    let data = mode === 'empty' ? [] : sampleMembers;
    if (url.searchParams.has('netid')) data = mode === 'empty' ? null : sampleMembers[0];
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
  });
  await page.route('https://calendar.google.com/**', route => route.fulfill({contentType:'text/html', body:'<p>Calendar test fixture</p>'}));
}
async function metrics(page) {
  return page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const outside = [...document.querySelectorAll('body *')].filter(el => {
      if (el.closest('.sponsors-track, .slick-list, .hero-image-wrap, .mission, .pillar-card-photo, .photo-right, .redesign-hero-image, .wwa-hero-image-wrap, .wwa-team-photo-wrap, .corporate-sponsor-card, .featured-event-card, .section-images')) return false;
      const style = getComputedStyle(el), r = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && r.width && (r.right > w + 1 || r.left < -1);
    }).slice(0, 12).map(el => ({tag:el.tagName, class:el.className, text:el.textContent?.slice(0, 60)}));
    const h = document.querySelector('h1');
    return { width: w, scrollWidth: document.documentElement.scrollWidth, titleSize:h ? getComputedStyle(h).fontSize : null, outside };
  });
}
async function run() {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({headless: true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
  const page = await browser.newPage();
  await fixtures(page);
  const results=[];
  for (const route of routes) {
    await page.setViewportSize({width:1920,height:1080});
    await page.goto(`${baseURL}/${route}`, {waitUntil:'domcontentloaded'});
    await page.locator('h1').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({width,height:1080});
      await page.waitForTimeout(60);
      const result={route:route||'home', ...await metrics(page)};
      results.push(result);
      if ([1920,390].includes(width)) {
        await page.screenshot({path:path.join(output,`${route||'home'}-${width}.png`),fullPage:true});
      }
      if (result.scrollWidth > result.width + 1 || result.outside.length) console.log(JSON.stringify(result));
    }
    console.log('checked',route||'home');
  }
  fs.writeFileSync(path.join(output,'layout-results.json'),JSON.stringify(results,null,2));
  await browser.close();
  assert.equal(results.filter(r=>r.scrollWidth>r.width+1 || r.outside.length).length,0,'Layout overflow detected; inspect layout-results.json');
}
module.exports={fixtures,metrics,sampleMembers,routes};
if(require.main===module) run().catch(e=>{console.error(e);process.exitCode=1});
