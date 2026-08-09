import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const BASE='http://127.0.0.1:4173/candidate.html';
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
const browser=await chromium.launch({headless:true});
try{
 const {context,page,errors}=await cleanPage(browser,{width:1280,height:900});
 const values=await page.locator('#month option').evaluateAll(os=>os.map(o=>o.value));
 for(const v of values){await page.selectOption('#month',v);await page.waitForTimeout(20);assert.equal(await page.locator('text=Dashboard error').count(),0,`month ${v} failed`)}
 await page.selectOption('#month','2026-07');
 for(const [label,needle] of [['Big picture','Current cash'],['Month by month','Starting cash'],['Transactions','Transactions ·'],['Accounts','Cash accounts'],['Rules','Category rules']]){
  await page.getByRole('tab',{name:label}).click();assert.match(await page.locator('#app').innerText(),new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 }
 await page.getByRole('tab',{name:'Transactions'}).click();
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
 await page.locator('.txrow').first().click();await page.locator('#catEdit').selectOption({label:'Personal Care'});await page.locator('input[name="scope"][value="merchant"]').check();await page.locator('#saveCat').click();await page.getByRole('tab',{name:'Rules'}).click();assert.ok(await page.locator('[data-delete-rule]').count()>0,'merchant rule not created');await page.locator('[data-delete-rule]').first().click();
 await page.getByRole('tab',{name:'Big picture'}).click();const cc=page.locator('[data-action="creditMonth"]');assert.ok(await cc.count()>0,'credit-card detail trigger missing');await cc.first().click();assert.match(await page.locator('#modalBody').innerText(),/Barclays JetBlue Plus/);assert.match(await page.locator('#modalBody').innerText(),/Known balance total/);await page.locator('#closeModal').click();
 const auto=page.locator('[data-action="autoLoan"]');if(await auto.count()){await auto.first().click();assert.match(await page.locator('#modalBody').innerText(),/Rough payments/);await page.locator('#closeModal').click()}
 await page.getByRole('tab',{name:'Transactions'}).click();const hide=page.locator('#hideInternal');await hide.check();assert.equal(await page.evaluate(()=>localStorage.getItem('hideInternalTransfers')),'1');
 assert.deepEqual(errors,[],errors.join('\n'));await context.close();
 const mobile=await cleanPage(browser,{width:390,height:844});assert.ok(await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'mobile body overflows viewport');await mobile.page.getByRole('tab',{name:'Accounts'}).click();assert.match(await mobile.page.locator('#app').innerText(),/Cash accounts/);assert.deepEqual(mobile.errors,[],mobile.errors.join('\n'));await mobile.context.close();
 const c=await browser.newContext();const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route('**/data-static.js*',r=>r.abort());await p.goto(BASE,{waitUntil:'networkidle'});assert.match(await p.locator('#app').innerText(),/Dashboard error[\s\S]*Dashboard data failed to load/);assert.deepEqual(errs,[]);await c.close();
 console.log('Browser smoke passed: desktop, mobile, navigation, filters, editing, undo/redo, rules, card/loan details, and graceful data failure.');
} finally {await browser.close();}
