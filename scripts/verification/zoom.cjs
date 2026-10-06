/* global chrome */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const {fixtures,routes,metrics}=require('./layout.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'urmc-browser-zoom-'));
 const extension=path.join(temp,'extension');fs.mkdirSync(extension);
 fs.writeFileSync(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Local browser zoom verification',version:'1.0',permissions:['tabs'],background:{service_worker:'worker.js'}}));
 fs.writeFileSync(path.join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(() => {});');
 const context=await chromium.launchPersistentContext(path.join(temp,'profile'),{headless:true,viewport:null,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--window-size=1920,1080',`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 const page=await context.newPage();await fixtures(page);
 const results=[];const output=process.env.OUTPUT_DIR||'/tmp/urmc-zoom/after';fs.mkdirSync(output,{recursive:true});
 const baseURL=process.env.BASE_URL||'http://localhost:3001';
 for(const route of routes){
  await page.goto(`${baseURL}/${route}`,{waitUntil:'domcontentloaded'});await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
  for(const zoom of [.8,1,1.25,1.5,2]){
   await worker.evaluate(async({zoom,baseURL})=>{const tabs=await chrome.tabs.query({url:`${baseURL}/*`});await chrome.tabs.setZoom(tabs[0].id,zoom)},{zoom,baseURL});
   await page.waitForTimeout(150);
   const result={route:route||'home',zoom,...await metrics(page),...await page.evaluate(()=>({outerWidth:window.outerWidth,devicePixelRatio:window.devicePixelRatio,viewportHeight:window.innerHeight,bodySize:getComputedStyle(document.querySelector('.hero-subtitle,.wwa-hero-subtitle,.gi-hero-subtitle,.ta-hero__subtitle,.points-hero-subtitle,.redesign-hero-copy p')||document.querySelector('h1')).fontSize}))};
   results.push(result);
   assert.equal(result.outerWidth,1920,'Desktop window must stay fixed');
   assert.ok(Math.abs(result.devicePixelRatio-zoom)<.01,'Must use actual browser zoom');
   if(['','events'].includes(route)&&[.8,1,2].includes(zoom))await page.screenshot({path:path.join(output,`${route||'home'}-zoom-${zoom}.png`)});
  }
 }
 await context.close();
 fs.writeFileSync(path.join(output,'zoom-results.json'),JSON.stringify(results,null,2));
 for (const route of routes.map(r => r || 'home')) {
  const samples = results.filter(r => r.route === route);
  const normal = samples.find(r => r.zoom === 1);
  const smaller = samples.find(r => r.zoom === .8);
  const larger = samples.find(r => r.zoom === 2);
  assert.ok(smaller.viewportHeight > normal.viewportHeight, 'Zoom out must expose more vertical content');
  assert.ok(parseFloat(smaller.bodySize) * smaller.zoom < parseFloat(normal.bodySize), 'Zoom out must make text smaller');
  assert.ok(parseFloat(larger.bodySize) * larger.zoom > parseFloat(normal.bodySize), 'Zoom in must make text larger');
 }
 const bad=results.filter(r=>r.scrollWidth>r.width+1||r.outside.length);
 console.log(JSON.stringify({checks:results.length,failures:bad},null,2));
 assert.equal(bad.length,0,'Zoom overflow detected');
})();
