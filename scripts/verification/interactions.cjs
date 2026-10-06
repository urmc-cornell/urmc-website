const playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const {fixtures,metrics,routes}=require('./layout.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const baseURL=process.env.BASE_URL||'http://localhost:3001';
const output=process.env.OUTPUT_DIR||'/tmp/urmc-zoom/after';
(async()=>{
 const results=[];
 for(const engine of (process.env.BROWSERS || 'chromium,firefox,webkit').split(',')){
  const browser=await playwright[engine].launch({headless:true,...(engine==='chromium'&&process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  const page=await browser.newPage();await fixtures(page);
  for(const width of [390,960,1920]){
   await page.setViewportSize({width,height:1080});
   for(const route of routes){
    await page.goto(`${baseURL}/${route}`,{waitUntil:'domcontentloaded'});await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
    const m=await metrics(page);assert.ok(m.scrollWidth<=m.width+1,`${engine} ${route} overflow at ${width}`);
   }
  }
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:1000});
   await page.goto(baseURL);
   if(width<=1024){
    await page.locator('.menu-icon').click();assert.equal(await page.locator('.menu-icon').getAttribute('aria-expanded'),'true');assert.ok(await page.locator('.nav-container').isVisible());await page.locator('.menu-icon').click();
   }else{
    assert.equal(await page.locator('.menu-icon').isVisible(),false,'Laptop navigation must retain desktop links');
    assert.ok(await page.locator('.nav-menu--left').isVisible());assert.ok(await page.locator('.nav-menu--right').isVisible());
   }
   const pillar=page.locator('.pillar-card').first();await pillar.focus();await page.keyboard.press('Enter');assert.equal(await pillar.getAttribute('aria-expanded'),'true');await page.keyboard.press('Enter');assert.equal(await pillar.getAttribute('aria-expanded'),'false');
   const visibleLogos=await page.locator('.sponsor-logo').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.right>0&&r.left<window.innerWidth}).length);assert.ok(visibleLogos>=3,'Carousel must show multiple bounded logos');
   await page.goto(`${baseURL}/ta-directory`);await page.locator('.ta-card').first().waitFor();assert.equal(await page.locator('.ta-card').count(),12);await page.locator('.ta-filters__btn').filter({hasText:'INFO'}).click();assert.equal(await page.locator('.ta-card').count(),6);await page.locator('.ta-search__input').fill('NoSuchCourse');assert.equal(await page.locator('.ta-card').count(),0);
   await page.goto(`${baseURL}/leadership`);const member=page.locator('.wwa-member-card').first();await member.click();await page.getByRole('dialog').waitFor();const close=page.getByRole('button',{name:'Close',exact:true});assert.ok(await close.isVisible());assert.equal(await close.evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement === document.body || document.activeElement.closest('dialog') !== null),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.evaluate(()=>document.activeElement.className),'wwa-member-card');
   const presidents=page.getByRole('button',{name:'Presidents',exact:true});await presidents.focus();await page.keyboard.press('Enter');assert.equal(await presidents.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.wwa-member-card').count(),1);assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Presidents');
   await page.getByRole('button',{name:'Advisors',exact:true}).click();assert.equal(await page.locator('.wwa-member-card').count(),3);assert.equal(await presidents.getAttribute('aria-pressed'),'false');
   await page.getByRole('button',{name:'Full Team',exact:true}).click();assert.equal(await page.locator('.wwa-member-card').count(),12);
   await page.goto(`${baseURL}/events`);assert.equal(await page.locator('.featured-event-card').count(),6);assert.equal(await page.locator('button.featured-event-card').count(),0);await page.locator('.featured-event-card').first().click();assert.equal(await page.locator('dialog').count(),0);
   await page.goto(`${baseURL}/sponsors`);const partner=page.getByRole('button',{name:'Become a Partner'});await partner.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await partner.evaluate(el=>el===document.activeElement),true);
   await page.goto(`${baseURL}/points`);await page.getByRole('textbox',{name:'Cornell NetID'}).fill('test0');await page.getByRole('button',{name:'Enter',exact:true}).click();await page.getByText('8 pts',{exact:true}).first().waitFor();
   results.push({engine,width,interactions:'passed'});
  }
  for(const mode of ['empty','error']){
   const testPage=await browser.newPage({viewport:{width:390,height:900}});await fixtures(testPage,mode);
   for(const route of ['leadership','ta-directory','points']){
    await testPage.goto(`${baseURL}/${route}`,{waitUntil:'domcontentloaded'});
    await testPage.waitForTimeout(150);
    const m=await metrics(testPage);assert.ok(m.scrollWidth<=m.width+1,`${engine} ${route} ${mode} overflow`);
    if(route==='points'){
     await testPage.getByRole('textbox',{name:'Cornell NetID'}).fill('test0');await testPage.getByRole('button',{name:'Enter',exact:true}).click();
     await testPage.getByRole('status').filter({hasText:mode==='error'?'Error fetching points':'NetID not found'}).waitFor();
    }
   }
   await testPage.close();
  }
  await browser.close();console.log(engine,'passed');
  fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'interaction-results.json'),JSON.stringify(results,null,2));
 }
 fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'interaction-results.json'),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
