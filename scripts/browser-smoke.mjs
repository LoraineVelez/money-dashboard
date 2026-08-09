import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.env.DASHBOARD_URL||'http://127.0.0.1:4173/candidate.html';
const nav=(page,label)=>page.locator('.tab',{hasText:label}).first();
async function cleanPage(browser,viewport){
 const context=await browser.newContext({viewport});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push('pageerror: '+e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
 await page.goto(BASE,{waitUntil:'networkidle'});
 assert.equal(await page.locator('text=Dashboard error').count(),0,'dashboard rendered an error');
 assert.equal(await page.locator('#month option').count(),9,'month dropdown should contain 9 months');
 assert.match(await page.locator('#dataVersion').innerText(),/Data through July 2026/);
 return {context,page,errors};
}
async function assertNoViewportOverflow(page,label){
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`${label} overflows viewport`);
}
const browser=await chromium.launch({headless:true});
try{
 const {context,page,errors}=await cleanPage(browser,{width:1280,height:900});
 await assertNoViewportOverflow(page,'desktop');
 assert.equal((await page.locator('#undoBtn').innerText()).trim(),'↶','undo should be icon only');
 assert.equal((await page.locator('#redoBtn').innerText()).trim(),'↷','redo should be icon only');
 const values=await page.locator('#month option').evaluateAll(os=>os.map(o=>o.value));
 for(const v of values){await page.selectOption('#month',v);await page.waitForTimeout(20);assert.equal(await page.locator('text=Dashboard error').count(),0,`month ${v} failed`)}
 await page.selectOption('#month','2026-07');
 for(const [label,needle] of [['Big picture','Current cash'],['Month by month','Starting cash'],['Transactions','Transactions ·'],['Accounts','Cash accounts'],['Rules','Category rules']]){
  await nav(page,label).click();assert.match(await page.locator('#app').innerText(),new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));await assertNoViewportOverflow(page,'desktop '+label);
 }
 await nav(page,'Upcoming').click();assert.match(await page.locator('#app').innerText(),/Upcoming ·/);assert.ok(await page.locator('.calendargrid').count(),'upcoming calendar missing');assert.ok(await page.locator('.aireview').count(),'recurring review section missing');assert.ok(await page.locator('#refreshRecurring').count(),'refresh scan control missing');await assertNoViewportOverflow(page,'desktop Upcoming');
 await page.locator('#refreshRecurring').click();assert.match(await page.locator('.scanstatus').innerText(),/Refreshed\. Rechecked all/);
 const billCount=await page.locator('.billrow').count();assert.ok(billCount>0,'no unpaid recurring bills detected from statement history');
 const due=page.locator('.dueinput').first();const oldDue=await due.inputValue();const oldDay=Number(oldDue.slice(-2)),newDay=oldDay===15?16:15;const newDue=oldDue.slice(0,-2)+String(newDay).padStart(2,'0');await due.fill(newDue);await due.dispatchEvent('change');assert.equal(Number((await page.locator('.dueinput').first().inputValue()).slice(-2)),newDay,'due date edit did not persist');
 const firstKey=await page.locator('.paidbtn').first().getAttribute('data-paid-key');const beforePaid=await page.locator('.billrow').count();await page.locator('.paidbtn').first().click();assert.equal(await page.locator('.billrow').count(),beforePaid-1,'paid recurring item should disappear from Upcoming');
 await page.evaluate(key=>localStorage.removeItem('billPaid:'+new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0')+':'+key),firstKey).catch(()=>{});
 await nav(page,'Transactions').click();
 await page.locator('#search').fill('THIS-WILL-NOT-MATCH-ANYTHING');assert.equal(await page.locator('.txrow').count(),0);
 let netflixFound=false;
 for(const v of values){await page.selectOption('#month',v);await page.locator('#search').fill('NETFLIX.COM');if(await page.locator('.txrow').count()){netflixFound=true;assert.match(await page.locator('.txrow').first().innerText(),/Subscriptions & Digital/);break}}
 assert.ok(netflixFound,'Netflix transaction not found');
 let p2pFound=false;
 for(const v of values){await page.selectOption('#month',v);await page.locator('#search').fill('VENMO');if(await page.locator('.txrow').count()){p2pFound=true;await page.locator('.txrow').first().click();assert.equal(await page.locator('input[name="scope"][value="merchant"]').isDisabled(),true);await page.locator('#closeModal').click();break}}
 assert.ok(p2pFound,'P2P test transaction not found');
 await page.selectOption('#month','2026-07');await page.locator('#search').fill('TARGET');
 if(!await page.locator('.txrow').count()){await page.locator('#search').fill('AMAZON')}
 assert.ok(await page.locator('.txrow').count()>0,'editable merchant transaction not found');
 const row=page.locator('.txrow').first();await row.click();const original=await page.locator('#catEdit').inputValue();
 const replacement=original==='Home'?'Entertainment':'Home';await page.locator('#catEdit').selectOption({label:replacement});await page.locator('input[name="scope"][value="one"]').check();await page.locator('#saveCat').click();
 assert.match(await page.locator('.txrow').first().innerText(),new RegExp(replacement));await page.locator('#undoBtn').click();assert.doesNotMatch(await page.locator('.txrow').first().innerText(),new RegExp(replacement));await page.locator('#redoBtn').click();assert.match(await page.locator('.txrow').first().innerText(),new RegExp(replacement));
 await page.locator('.txrow').first().click();await page.locator('#catEdit').selectOption({label:'Personal Care'});await page.locator('input[name="scope"][value="merchant"]').check();await page.locator('#saveCat').click();await nav(page,'Rules').click();assert.ok(await page.locator('[data-delete-rule]').count()>0,'merchant rule not created');await page.locator('[data-delete-rule]').first().click();
 await nav(page,'Big picture').click();const cc=page.locator('[data-action="creditMonth"]');assert.ok(await cc.count()>0,'credit-card detail trigger missing');await cc.first().click();assert.match(await page.locator('#modalBody').innerText(),/Barclays JetBlue Plus/);assert.match(await page.locator('#modalBody').innerText(),/Known balance total/);await page.locator('#closeModal').click();
 const auto=page.locator('[data-action="autoLoan"]');if(await auto.count()){await auto.first().click();assert.match(await page.locator('#modalBody').innerText(),/Rough payments/);await page.locator('#closeModal').click()}
 await nav(page,'Transactions').click();const hide=page.locator('#hideInternal');if(!(await hide.isChecked()))await hide.check();assert.equal(await page.evaluate(()=>localStorage.getItem('hideInternalTransfers')),'1');
 await page.locator('#categoryFilter').selectOption({label:'Shopping'});assert.ok(await page.locator('.txrow').count()>0,'Shopping category filter returned nothing');
 await page.locator('#categoryFilter').selectOption({label:'All'});if(await page.locator('#reviewNow').count()){await page.locator('#reviewNow').click();assert.equal(await page.locator('#categoryFilter').inputValue(),'Needs Review')}
 await nav(page,'Month by month').click();if(await page.locator('.pie-slice').count()){const slice=page.locator('.pie-slice').first();assert.ok(((await slice.locator('title').textContent())||'').length>3,'pie slice tooltip missing');await slice.click();assert.ok(await page.locator('#modal').evaluate(d=>d.open));await page.locator('#closeModal').click()}
 if(await page.locator('.legendbtn').count()){await page.locator('.legendbtn').first().click();assert.ok(await page.locator('#modal').evaluate(d=>d.open));await page.locator('#closeModal').click()}
 const beforeTheme=await page.locator('html').getAttribute('data-theme');await page.locator('#themeToggle').click();const afterTheme=await page.locator('html').getAttribute('data-theme');assert.notEqual(afterTheme,beforeTheme,'theme toggle should still work');await assertNoViewportOverflow(page,'desktop dark/light theme');
 assert.deepEqual(errors,[],errors.join('\n'));await context.close();

 for(const viewport of [{width:390,height:844,name:'mobile 390'},{width:360,height:800,name:'mobile 360'},{width:768,height:1024,name:'tablet'}]){
  const m=await cleanPage(browser,{width:viewport.width,height:viewport.height});
  await assertNoViewportOverflow(m.page,viewport.name+' initial');
  assert.equal((await m.page.locator('#undoBtn').innerText()).trim(),'↶',viewport.name+' undo text');
  assert.equal((await m.page.locator('#redoBtn').innerText()).trim(),'↷',viewport.name+' redo text');
  for(const label of ['Big picture','Month by month','Transactions','Accounts','Upcoming','Rules']){
    await nav(m.page,label).click();await m.page.waitForTimeout(20);await assertNoViewportOverflow(m.page,viewport.name+' '+label);
  }
  await nav(m.page,'Upcoming').click();assert.match(await m.page.locator('#app').innerText(),/Upcoming ·/);assert.ok(await m.page.locator('#refreshRecurring').count(),viewport.name+' refresh scan missing');
  await nav(m.page,'Accounts').click();assert.match(await m.page.locator('#app').innerText(),/Cash accounts/);
  assert.deepEqual(m.errors,[],m.errors.join('\n'));await m.context.close();
 }
 if(!process.env.DASHBOARD_URL){const c=await browser.newContext();const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route('**/data-static.js*',r=>r.abort());await p.goto(BASE,{waitUntil:'networkidle'});assert.match(await p.locator('#app').innerText(),/Dashboard error[\s\S]*Dashboard data failed to load/);assert.deepEqual(errs,[]);await c.close()}
 console.log('Browser smoke passed: visual overflow checks at desktop/tablet/mobile, icon-only history controls, theme switching, refreshable recurring review, auto-clearing paid reminders, editable due dates, months, navigation, filters, charts, editing, undo/redo, rules, card/loan details, and graceful data failure.');
} finally {await browser.close();}
