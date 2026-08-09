
(async()=>{try{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const b=atob(window.DATA_GZ||"");const bytes=new Uint8Array(b.length);for(let i=0;i<b.length;i++)bytes[i]=b.charCodeAt(i);
const ds=new DecompressionStream("gzip");const txt=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
const R=JSON.parse(txt);

const VERIFIED={
'2025-11':{start:8348.48,end:7731.68,ea:[.01,7731.67,0]},
'2025-12':{start:7731.68,end:14176.60,ea:[.01,14006.71,169.88]},
'2026-01':{start:14176.60,end:15139.40,ea:[.01,14607.70,531.69]},
'2026-02':{start:15139.40,end:16775.03,ea:[.01,14506.97,2268.05]},
'2026-03':{start:16775.03,end:16678.03,ea:[.01,16007.72,670.30]},
'2026-04':{start:16678.03,end:18294.41,ea:[.01,18007.66,286.74]},
'2026-05':{start:18294.41,end:20860.45,ea:[.01,19508.53,1351.91]},
'2026-06':{start:20860.45,end:19868.95,ea:[.01,19609.18,259.76]},
'2026-07':{start:19868.95,end:24394.25,ea:[3000.03,20424.20,970.02]}
};
const DATA={order:R.order,months:{}};
R.order.forEach(k=>{
 const x=R.months[k],v=VERIFIED[k]||{};
 DATA.months[k]={...x,start:v.start??x.start,end:v.end??x.end,
  startAccounts:{'Regular Savings':x.sa[0],'Bright Future Savings':x.sa[1],'Debit Account':x.sa[2]},
  endAccounts:{'Regular Savings':(v.ea||x.ea)[0],'Bright Future Savings':(v.ea||x.ea)[1],'Debit Account':(v.ea||x.ea)[2]},
  tx:x.tx.map((t,i)=>({id:k+'-'+i,date:`${k}-${String(t[0]).padStart(2,'0')}`,account:R.accounts[t[1]],merchant:R.merchants[t[2]],description:R.merchants[t[2]],amount:+t[3],category:R.cats[t[4]]}))
 };
});
const D=DATA.months, order=DATA.order, latest=order.at(-1), sel=$('#month');

const K401=[{date:'Dec 31, 2025',balance:4061.56},{date:'Mar 31, 2026',balance:7069.06},{date:'Jun 30, 2026',balance:8708.28}];
const ROTH=[{date:'Nov 30, 2025',balance:13668.75},{date:'Dec 31, 2025',balance:13688.39},{date:'Jan 31, 2026',balance:14004.43},{date:'Feb 28, 2026',balance:14140.20},{date:'Mar 31, 2026',balance:13405.30},{date:'Apr 30, 2026',balance:14591.68},{date:'May 31, 2026',balance:15254.19},{date:'Jun 30, 2026',balance:15300.03},{date:'Jul 31, 2026',balance:15080.31}];
const AUTOLOAN=[{date:'Nov 17, 2025',balance:13562.66},{date:'Dec 17, 2025',balance:13299.50},{date:'Jan 15, 2026',balance:13031.81},{date:'Feb 18, 2026',balance:12776.37},{date:'Mar 17, 2026',balance:12499.99},{date:'Apr 16, 2026',balance:12230.02},{date:'May 15, 2026',balance:11955.72},{date:'Jun 17, 2026',balance:11689.92},{date:'Jul 20, 2026',balance:11416.02}];
const AUTO_ORIGINAL=20591.91,AUTO_PAYMENT=350;
const CREDIT_HISTORY={
'2025-11':[{name:'Capital One QuicksilverOne',balance:308.80,asof:'Nov 20, 2025'},{name:'Amazon / Chase',balance:723.12,asof:'Nov 4, 2025'},{name:'Members 1st Visa Signature',balance:0,asof:'Nov 2, 2025'}],
'2025-12':[{name:'Capital One QuicksilverOne',balance:249.45,asof:'Dec 21, 2025'},{name:'Amazon / Chase',balance:613.82,asof:'Dec 4, 2025'},{name:'Members 1st Visa Signature',balance:21.60,asof:'Dec 1, 2025'}],
'2026-01':[{name:'Capital One QuicksilverOne',balance:208.25,asof:'Jan 21, 2026'},{name:'Amazon / Chase',balance:839.88,asof:'Jan 4, 2026'},{name:'Members 1st Visa Signature',balance:43.76,asof:'Jan 1, 2026'}],
'2026-02':[{name:'Capital One QuicksilverOne',balance:977.66,asof:'Feb 18, 2026'},{name:'Amazon / Chase',balance:618.71,asof:'Feb 4, 2026'},{name:'Members 1st Visa Signature',balance:86.18,asof:'Feb 1, 2026'}],
'2026-03':[{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026',status:'inferred'},{name:'Amazon / Chase',balance:535.21,asof:'Mar 4, 2026'},{name:'Members 1st Visa Signature',balance:-35.40,asof:'Mar 1, 2026'},{name:'Barclays JetBlue Plus',balance:0,asof:'Mar 26, 2026',status:'exact'}],
'2026-04':[{name:'Capital One QuicksilverOne',balance:556.23,asof:'Apr 20, 2026'},{name:'Amazon / Chase',balance:298.72,asof:'Apr 4, 2026'},{name:'Members 1st Visa Signature',balance:37.77,asof:'Apr 1, 2026'},{name:'Barclays JetBlue Plus',balance:1506.86,asof:'Apr 26, 2026',status:'exact'}],
'2026-05':[{name:'Capital One QuicksilverOne',balance:534.05,asof:'May 21, 2026'},{name:'Amazon / Chase',balance:0,asof:'May 4, 2026'},{name:'Members 1st Visa Signature',balance:0,asof:'May 1, 2026'},{name:'Barclays JetBlue Plus',balance:1231.91,asof:'May 26, 2026',status:'exact'}],
'2026-06':[{name:'Capital One QuicksilverOne',balance:699.30,asof:'Jun 20, 2026'},{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026',status:'inferred'},{name:'Members 1st Visa Signature',balance:0,asof:'Jun 1, 2026'},{name:'Barclays JetBlue Plus',balance:1288.42,asof:'Jun 26, 2026',status:'exact'}],
'2026-07':[{name:'Capital One QuicksilverOne',balance:519.26,asof:'Jul 21, 2026'},{name:'Amazon / Chase',balance:157.20,asof:'Jul 4, 2026'},{name:'Members 1st Visa Signature',balance:0,asof:'Jul 1, 2026'},{name:'Barclays JetBlue Plus',balance:722.36,asof:'Jul 26, 2026',status:'exact'}]
};

const CATS=['Income','Housing','Groceries & Dining','Shopping','Vehicle & Transportation','Bills & Utilities','Subscriptions & Digital','Home','Entertainment','Health','Travel','Gifts & Donations','Personal Care','Education','Savings / Investing','Debt Payment','Other','Needs Review'];
const LEGACY={'Other Income':'Income','Rent':'Housing','Food & Dining':'Groceries & Dining','Dining / Delivery':'Groceries & Dining','Groceries':'Groceries & Dining','Shopping / Retail':'Shopping','Retail':'Shopping','Transportation':'Vehicle & Transportation','Gas / Convenience':'Vehicle & Transportation','Gas':'Vehicle & Transportation','Parking':'Vehicle & Transportation','Transit':'Vehicle & Transportation','Phone':'Bills & Utilities','Utilities':'Bills & Utilities','Software / Digital':'Subscriptions & Digital','Auto / Car Wash':'Subscriptions & Digital','Entertainment / Subscriptions':'Subscriptions & Digital','Entertainment / Activities':'Entertainment','Medical':'Health','Gifts':'Gifts & Donations','Donations':'Gifts & Donations','Savings':'Savings / Investing','Investing':'Savings / Investing','Credit Card Payment':'Debt Payment','Other Spending':'Other','Person-to-Person':'Needs Review','External Transfer':'Needs Review','External Transfer / Deposit':'Needs Review','Other Deposit':'Needs Review','Refund / Reimbursement':'Needs Review','Internal Transfer':'Needs Review'};
const fmt=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n||0);
const fmt2=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n||0);
const dateFmt=s=>{const[y,m,d]=s.split('-').map(Number);return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(y,m-1,d))};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const canonical=c=>CATS.includes(c)?c:(LEGACY[c]||'Needs Review');
const source=t=>(t.description||t.merchant||'Unknown source').trim();

function isP2P(t){return /VENMO|ZELLE|CASH ?APP|APPLE CASH|PERSON-TO-PERSON/i.test(source(t))}
function internal(t){const s=source(t).toUpperCase();return /(?:ONLINE BANKING )?TRANSFER (?:TO|FROM) SHARE (?:01|02|31)\b/.test(s)||t.category==='Internal Transfer'}
function debtPayment(t){const s=source(t).toUpperCase();return /CAPITAL ONE.*(?:PMT|CRCARD)|CHASE CREDIT CRD|BARCLAYCARD|ACH VISA TYPE: PAYMENT/.test(s)}
function txKey(t){return'catOverride:'+t.date+'|'+t.account+'|'+t.amount+'|'+source(t)}
function normalizeMerchant(s){
 s=s.toUpperCase()
 .replace(/WITHDRAWAL|DEPOSIT|RECURRING|DEBIT CARD|CREDIT CARD|MERCH\.?\s*POST:?\s*\d{1,2}\/\d{1,2}|POS\s*#?\d+|ACH|TYPE:.*?(?=CO:|NAME:|$)|DATA:.*?(?=CO:|NAME:|$)|CO:|NAME:/g,' ')
 .replace(/\b\d{2,}\b/g,' ')
 .replace(/[^\w&*.-]+/g,' ')
 .replace(/\s+/g,' ').trim();
 return s||source({description:s});
}
function merchantKey(t){return'merchantRule:'+normalizeMerchant(source(t))}
function manualOverride(t){const v=localStorage.getItem(txKey(t));return v?canonical(v):null}
function merchantRule(t){if(isP2P(t))return null;const v=localStorage.getItem(merchantKey(t));return v?canonical(v):null}
function effective(t){
 const one=manualOverride(t); if(one)return one;
 const rule=merchantRule(t); if(rule)return rule;
 const s=source(t).toUpperCase();
 if(isP2P(t))return'Needs Review';
 if(/JWALES|JOHNSON.*WALES/.test(s))return'Education';
 if(/WHOLE ?FOODS/.test(s))return'Groceries & Dining';
 if(/AMAZON PRIME/.test(s))return'Subscriptions & Digital';
 if(/AMAZON|AMZN/.test(s))return'Shopping';
 if(t.amount<0&&Math.abs(Math.abs(t.amount)-350)<.01&&/MEMBERS ?1ST|MEMBERS FIRST/.test(s))return'Vehicle & Transportation';
 return canonical(t.category);
}
function isEdited(t){return !!manualOverride(t)}
function moneyInRows(x){return x.tx.filter(t=>t.amount>0&&!internal(t))}
function moneyOutRows(x){return x.tx.filter(t=>t.amount<0&&!internal(t))}
function spendingRows(x){return moneyOutRows(x).filter(t=>!debtPayment(t))}
function moneyIn(x){return moneyInRows(x).reduce((a,t)=>a+t.amount,0)}
function spendTotal(x){return spendingRows(x).reduce((a,t)=>a+Math.abs(t.amount),0)}
function spendCats(x){const o={};spendingRows(x).forEach(t=>{const c=effective(t);o[c]=(o[c]||0)+Math.abs(t.amount)});return o}
function categoryRows(x,c){return x.tx.filter(t=>!internal(t)&&effective(t)===c)}
function categoryNet(x){const o={};x.tx.filter(t=>!internal(t)).forEach(t=>{const c=effective(t);o[c]=(o[c]||0)+t.amount});return o}
function reviewRows(x){return x.tx.filter(t=>!internal(t)&&effective(t)==='Needs Review')}
function cleanupPct(x){const eligible=x.tx.filter(t=>!internal(t)),done=eligible.filter(t=>effective(t)!=='Needs Review').length;return eligible.length?Math.round(done/eligible.length*100):100}
function reconciliation(x){const flow=x.tx.filter(t=>!internal(t)).reduce((a,t)=>a+t.amount,0),expected=x.start+flow,diff=x.end-expected;return{expected,diff,ok:Math.abs(diff)<.02}}
function creditCards(k){return CREDIT_HISTORY[k]||[]}
function creditTotal(k){return creditCards(k).reduce((a,c)=>a+Math.max(0,c.balance),0)}
function creditTrend(k){const i=order.indexOf(k);if(i<1)return'No prior month available';const d=creditTotal(k)-creditTotal(order[i-1]);if(Math.abs(d)<.005)return'No change from previous month';return`<span class="${d<0?'positive':'negative'}">${d<0?'−':'+'}${fmt2(Math.abs(d))} ${d<0?'decrease':'increase'}</span> from previous month`}

const HKEY='moneyDashboardHistoryV2',RKEY='moneyDashboardRedoV2';
function getStack(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}}
function setStack(k,v){localStorage.setItem(k,JSON.stringify(v.slice(-50)))}
function record(changes,label){
 const h=getStack(HKEY);h.push({changes,label,ts:Date.now()});setStack(HKEY,h);setStack(RKEY,[]);
 applyChanges(changes,'after'); updateUndoRedo();
}
function applyChanges(changes,side){changes.forEach(c=>{const v=c[side];if(v===null||v===undefined)localStorage.removeItem(c.key);else localStorage.setItem(c.key,v)})}
function undo(){const h=getStack(HKEY);if(!h.length)return;const a=h.pop();applyChanges(a.changes,'before');setStack(HKEY,h);const r=getStack(RKEY);r.push(a);setStack(RKEY,r);render();updateUndoRedo()}
function redo(){const r=getStack(RKEY);if(!r.length)return;const a=r.pop();applyChanges(a.changes,'after');setStack(RKEY,r);const h=getStack(HKEY);h.push(a);setStack(HKEY,h);render();updateUndoRedo()}
function updateUndoRedo(){const u=$('#undoBtn'),r=$('#redoBtn');if(u)u.disabled=!getStack(HKEY).length;if(r)r.disabled=!getStack(RKEY).length}
function saveCategory(t,c,scope){
 c=canonical(c);const changes=[];const tk=txKey(t),old=localStorage.getItem(tk);
 changes.push({key:tk,before:old,after:c});
 if(scope==='merchant'&&!isP2P(t)){const mk=merchantKey(t),prev=localStorage.getItem(mk);changes.push({key:mk,before:prev,after:c})}
 record(changes,`Categorize ${source(t)} as ${c}`);
}
function deleteRule(key){record([{key,before:localStorage.getItem(key),after:null}],'Delete merchant rule')}

function card(l,v,n='',a='',f=''){return`<div class="card ${a?'clickable':''}" ${a?`data-action="${a}" data-filter="${esc(f)}"`:''}><div class="label">${l}${a?' · click to verify':''}</div><div class="value">${v}</div>${n?`<div class="note">${n}</div>`:''}</div>`}
function trendText(d,asof){if(d==null)return`<span class="muted">30-day change unavailable</span> · As of ${asof}`;if(Math.abs(d)<.005)return`<span class="muted">No change in last 30 days</span> · As of ${asof}`;return`<span class="${d>0?'positive':'negative'}">${d>0?'+':'−'}${fmt2(Math.abs(d))} ${d>0?'increase':'decrease'}</span> in last 30 days · As of ${asof}`}
function cashTrend(){const a=order.map(k=>D[k].end),W=760,H=220,p=34,min=Math.min(...a)*.92,max=Math.max(...a)*1.04,pts=a.map((v,i)=>[p+i*(W-2*p)/(a.length-1),H-p-(v-min)/(max-min)*(H-2*p)]);return`<svg viewBox="0 0 ${W} ${H}">${pts.length?`<polyline fill="none" stroke="#d8a7b1" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="${pts.map(q=>q.join(',')).join(' ')}"/>`:''}${pts.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="white" stroke="#d8a7b1" stroke-width="3"/><text x="${q[0]}" y="${Math.max(14,q[1]-12)}" text-anchor="middle" font-size="11" font-weight="700">${fmt(D[order[i]].end)}</text><text x="${q[0]}" y="212" text-anchor="middle" font-size="11" fill="#746d70">${D[order[i]].label.split(' ')[0]}</text>`).join('')}</svg>`}
const colors=['#c78998','#dfb6be','#ad7d8a','#e7cbd0','#b9929d','#f0dce0','#96707b','#d2a0aa','#e9bfc6','#7f5e67','#d8b782','#8fa58f'];
function pie(x){const e=Object.entries(spendCats(x)).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]),total=e.reduce((a,[,v])=>a+v,0),cx=150,cy=150,r=112;let a=-Math.PI/2,p=[],labs=[];if(!total)return`<div class="empty">No spending to chart.</div>`;e.forEach(([n,v],i)=>{const pct=v/total*100,a2=a+2*Math.PI*v/total,x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2),lg=a2-a>Math.PI?1:0,mid=(a+a2)/2;p.push(`<path class="clickable pie-slice" data-action="category" data-filter="${esc(n)}" d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} Z" fill="${colors[i%colors.length]}"><title>${esc(n)} ${fmt2(v)} ${pct.toFixed(1)}%</title></path>`);if(pct>=2)labs.push(`<text pointer-events="none" x="${cx+88*Math.cos(mid)}" y="${cy+88*Math.sin(mid)}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" stroke="#2d2a2b" stroke-width="2.4" paint-order="stroke">${pct.toFixed(1)}%</text>`);a=a2});return`<div class="piebox"><svg viewBox="0 0 300 300">${p.join('')}${labs.join('')}<circle cx="150" cy="150" r="64" fill="#fff" pointer-events="none"/><text x="150" y="144" text-anchor="middle" font-size="13" fill="#746d70">Bank spending</text><text x="150" y="166" text-anchor="middle" font-size="20" font-weight="700">${fmt(total)}</text></svg></div><div class="pielegend">${e.map(([n,v],i)=>`<button class="legendbtn" data-action="category" data-filter="${esc(n)}"><span class="legenddot" style="background:${colors[i%colors.length]}"></span><span>${esc(n)}</span><strong>${fmt2(v)} · ${(v/total*100).toFixed(1)}%</strong></button>`).join('')}</div>`}

function topReviewBar(){
 const x=D[sel.value],n=reviewRows(x).length,p=cleanupPct(x);
 return`<div class="reviewbar"><button class="reviewbtn" id="reviewNow"><strong>${n}</strong> need review</button><div class="progresswrap"><span>${x.label} cleanup: <strong>${p}% categorized</strong></span><div class="progress"><i style="width:${p}%"></i></div></div></div>`;
}
function overview(){const x=D[latest],prev=D[order.at(-2)],income=order.reduce((a,k)=>a+moneyIn(D[k]),0),spend=order.reduce((a,k)=>a+spendTotal(D[k]),0),auto=AUTOLOAN.at(-1).balance,cc=creditTotal(latest);return`${topReviewBar()}<div class="grid4">${card('Current cash',fmt(x.end),trendText(x.end-prev.end,x.label),'balance')}${card('Cash growth',fmt(x.end-prev.end),trendText(x.end-prev.end,x.label))}${card('Money in to date',fmt(income),'All external deposits','allIncome')}${card('Bank spending to date',fmt(spend),'Purchases excluding internal transfers and card payments','allSpending')}</div><div class="card section"><h2>Total cash balance trend</h2>${cashTrend()}</div><div class="grid4 section">${card('401(k)',fmt(K401.at(-1).balance),trendText(null,K401.at(-1).date))}${card('Roth IRA',fmt(ROTH.at(-1).balance),trendText(ROTH.at(-1).balance-ROTH.at(-2).balance,ROTH.at(-1).date))}${card('Known card balances',fmt(cc),creditTrend(latest),'creditMonth')}${card('Auto loan',fmt(auto),`Original ${fmt2(AUTO_ORIGINAL)} · ${fmt2(AUTO_PAYMENT)}/month · ${Math.ceil(auto/AUTO_PAYMENT)} payments left`,'autoLoan')}</div>`}

function summarySentence(x){const inc=moneyIn(x),sp=spendTotal(x),ch=x.end-x.start;return`In ${x.label}, you received <strong>${fmt2(inc)}</strong>, spent <strong>${fmt2(sp)}</strong> from bank accounts, and your cash <strong class="${ch>=0?'positive':'negative'}">${ch>=0?'increased':'decreased'} by ${fmt2(Math.abs(ch))}</strong>.`}
function reconciliationCard(x){const r=reconciliation(x);return`<div class="recon ${r.ok?'ok':'warn'}"><div><strong>${r.ok?'✓ Statement reconciled':'⚠ Reconciliation needs review'}</strong><div class="note">Starting cash + all external bank activity = ending cash</div></div><div class="reconnums"><span>Calculated ${fmt2(r.expected)}</span><span>Statement ${fmt2(x.end)}</span>${!r.ok?`<span>Difference ${fmt2(r.diff)}</span>`:''}</div></div>`}
function monthView(){const x=D[sel.value],c=spendCats(x),total=Object.values(c).reduce((a,b)=>a+b,0),activity=Object.entries(categoryNet(x)).filter(([,v])=>Math.abs(v)>.004).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));return`${topReviewBar()}<div class="grid4">${card('Starting cash',fmt(x.start),'Statement beginning balance','balance','start')}${card('Money in',fmt(moneyIn(x)),'All external deposits, regardless of category','income')}${card('Bank spending',fmt(total),'Purchases excluding internal transfers and card payments','spending')}${card('Ending cash',fmt(x.end),trendText(x.end-x.start,x.label),'balance','end')}</div><div class="summaryline">${summarySentence(x)}</div><div class="two section"><div class="card"><h2>Where my money went</h2>${pie(x)}</div><div class="card"><h2>By category</h2><div class="note" style="margin-bottom:12px">Positive means money came in. Negative means money went out.</div>${activity.map(([n,v])=>`<button class="categoryrow" data-action="category" data-filter="${esc(n)}"><span>${esc(n)}</span><strong class="${v>0?'positive':'negative'}">${v>0?'+':'−'}${fmt2(Math.abs(v))}</strong></button>`).join('')}</div></div><div class="grid4 section">${card('Known card balances',fmt(creditTotal(sel.value)),creditTrend(sel.value),'creditMonth')}${card('Change in cash',fmt(x.end-x.start),x.end>=x.start?'Cash increased this month':'Cash decreased this month')}<div class="callout" style="grid-column:span 2">Your saved categories override imported statement categories. Category and money direction are separate, so an Education deposit still counts as money in.</div></div><div class="section">${reconciliationCard(x)}</div>`}

let view='overview',search='',catFilter='All',hideInternal=localStorage.getItem('hideInternalTransfers')==='1',reviewOnly=false;
function txRows(a){return a.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<tr class="clickable txrow" data-id="${esc(t.id)}"><td>${dateFmt(t.date)}</td><td><strong>${esc(source(t))}</strong>${isEdited(t)?'<div class="edited">Edited by you</div>':''}${merchantRule(t)?'<div class="rulebadge">Rule applied</div>':''}</td><td><span class="pill">${esc(effective(t))}</span></td><td>${esc(t.account)}</td><td class="amount ${t.amount>0?'positive':'negative'}">${t.amount>0?'+':''}${fmt2(t.amount)}</td></tr>`).join('')}
function transactions(){
 const x=D[sel.value];let a=x.tx.filter(t=>(source(t)+' '+effective(t)+' '+t.account).toLowerCase().includes(search.toLowerCase()));
 if(catFilter!=='All')a=a.filter(t=>effective(t)===catFilter);
 if(hideInternal)a=a.filter(t=>!internal(t));
 if(reviewOnly)a=a.filter(t=>effective(t)==='Needs Review'&&!internal(t));
 const review=reviewRows(x).length,p=cleanupPct(x);
 return`${topReviewBar()}<div class="card txcard"><div class="txhead"><div><h2>Transactions · ${x.label}</h2><div class="muted">${a.length} shown · ${review} need review · ${p}% categorized</div></div><div class="txfilters"><input id="search" value="${esc(search)}" placeholder="Search source or category"><select id="categoryFilter"><option>All</option>${CATS.map(c=>`<option ${c===catFilter?'selected':''}>${c}</option>`).join('')}</select><label class="check"><input type="checkbox" id="hideInternal" ${hideInternal?'checked':''}> Hide internal transfers</label></div></div><div class="tablewrap"><table><thead><tr><th>Date</th><th>Source / statement detail</th><th>Category</th><th>Account</th><th>Amount</th></tr></thead><tbody>${txRows(a)}</tbody></table></div></div>`}

function accountDelta(name){const x=D[latest],p=D[order.at(-2)];return x.endAccounts[name]-(p.endAccounts[name]||0)}
function accounts(){const x=D[latest],auto=AUTOLOAN.at(-1).balance;return`${topReviewBar()}<div class="two"><div class="card"><h2>Cash accounts</h2>${Object.entries(x.endAccounts).map(([n,v])=>`<div class="accountrow"><span>${n}<div class="note">${trendText(accountDelta(n),x.label)}</div></span><strong>${fmt2(v)}</strong></div>`).join('')}</div><div class="card"><h2>Investments</h2><div class="accountrow"><span>401(k)<div class="note">As of ${K401.at(-1).date}</div></span><strong>${fmt2(K401.at(-1).balance)}</strong></div><div class="accountrow"><span>Roth IRA<div class="note">${trendText(ROTH.at(-1).balance-ROTH.at(-2).balance,ROTH.at(-1).date)}</div></span><strong>${fmt2(ROTH.at(-1).balance)}</strong></div></div><div class="card"><h2>Known card balances</h2>${creditCards(latest).map(c=>`<div class="accountrow"><span>${esc(c.name)}<div class="note">As of ${c.asof}${c.status==='inferred'?' · inferred':''}</div></span><strong>${fmt2(c.balance)}</strong></div>`).join('')}</div><div class="card"><h2>Auto loan</h2><div class="accountrow"><span>Remaining balance</span><strong>${fmt2(auto)}</strong></div><div class="note">Original ${fmt2(AUTO_ORIGINAL)} · ${fmt2(AUTO_PAYMENT)}/month · about ${Math.ceil(auto/AUTO_PAYMENT)} payments left</div></div></div>`}

function rules(){
 const rules=[];
 for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('merchantRule:'))rules.push([k,k.slice(13),canonical(localStorage.getItem(k))])}
 rules.sort((a,b)=>a[1].localeCompare(b[1]));
 return`<div class="card"><div class="txhead"><div><h2>Category rules</h2><div class="muted">Rules you created by choosing “This merchant, past & future.”</div></div><span class="pill">${rules.length} rules</span></div>${rules.length?`<div class="tablewrap ruleswrap"><table><thead><tr><th>Merchant pattern</th><th>Category</th><th></th></tr></thead><tbody>${rules.map(([k,n,c])=>`<tr><td>${esc(n)}</td><td><span class="pill">${esc(c)}</span></td><td class="amount"><button class="smallbtn danger" data-delete-rule="${esc(k)}">Delete</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No saved merchant rules yet.</div>'}</div>`}

function findTx(id){return D[sel.value].tx.find(t=>t.id===id)}
function openEditor(t){const m=$('#modal');$('#modalTitle').textContent=source(t);$('#modalSub').textContent=dateFmt(t.date)+' · '+t.account+' · '+fmt2(t.amount);$('#modalBody').innerHTML=`<div class="editor"><div class="direction"><span class="label">Direction</span><strong class="${t.amount>0?'positive':'negative'}">${t.amount>0?'Money in':'Money out'}</strong></div><label class="label">Category</label><select id="catEdit">${CATS.map(c=>`<option value="${esc(c)}" ${c===effective(t)?'selected':''}>${esc(c)}</option>`).join('')}</select><div class="scopebox"><label><input type="radio" name="scope" value="one" ${isP2P(t)?'checked':''}> Just this transaction</label><label class="${isP2P(t)?'disabled':''}"><input type="radio" name="scope" value="merchant" ${isP2P(t)?'disabled':'checked'}> This merchant, past & future</label></div><div class="note">${isP2P(t)?'Peer-to-peer payments will not create recurring rules.':'Merchant rules affect matching transactions across every month.'}</div><button id="saveCat" class="primarybtn">Save category</button></div>`;m.showModal();$('#saveCat').onclick=()=>{const scope=$('input[name="scope"]:checked')?.value||'one';saveCategory(t,$('#catEdit').value,scope);m.close();render()}}
function rowsFor(action,filter){const x=D[sel.value];if(action==='income')return moneyInRows(x);if(action==='spending')return spendingRows(x);if(action==='category')return categoryRows(x,filter);if(action==='allIncome')return order.flatMap(k=>moneyInRows(D[k]));if(action==='allSpending')return order.flatMap(k=>spendingRows(D[k]));return[]}
function openDetail(action,filter){const m=$('#modal'),title=$('#modalTitle'),sub=$('#modalSub'),body=$('#modalBody');if(action==='creditMonth'){const a=creditCards(sel.value);title.textContent='Known card balances';sub.textContent=D[sel.value].label;body.innerHTML=`<table><thead><tr><th>Credit card</th><th>Statement date</th><th class="amount">Balance</th></tr></thead><tbody>${a.map(c=>`<tr><td>${esc(c.name)}</td><td>${c.asof}${c.status==='inferred'?' · inferred':''}</td><td class="amount">${fmt2(c.balance)}</td></tr>`).join('')}</tbody></table><div class="modaltotal"><span>Known balance total</span><span>${fmt2(creditTotal(sel.value))}</span></div>`;m.showModal();return}
 if(action==='autoLoan'){title.textContent='Auto loan';sub.textContent='Balance history';body.innerHTML=`<div class="grid4 mini">${card('Original',fmt2(AUTO_ORIGINAL))}${card('Remaining',fmt2(AUTOLOAN.at(-1).balance))}${card('Monthly payment',fmt2(AUTO_PAYMENT))}${card('Payments left','~'+Math.ceil(AUTOLOAN.at(-1).balance/AUTO_PAYMENT))}</div><table><thead><tr><th>Date</th><th class="amount">Balance</th></tr></thead><tbody>${AUTOLOAN.map(r=>`<tr><td>${r.date}</td><td class="amount">${fmt2(r.balance)}</td></tr>`).join('')}</tbody></table>`;m.showModal();return}
 const a=rowsFor(action,filter);title.textContent=filter||({income:'Money in',spending:'Bank spending',allIncome:'All money in',allSpending:'All bank spending'}[action]||'Details');sub.textContent=action.startsWith('all')?'All statements':D[sel.value].label;const signed=action==='category'||action==='income'||action==='allIncome';body.innerHTML=`<table><thead><tr><th>Date</th><th>Source / description</th><th>Category</th><th>Account</th><th class="amount">Amount</th></tr></thead><tbody>${a.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<tr class="detailtx clickable" data-detail-id="${esc(t.id)}"><td>${dateFmt(t.date)}</td><td>${esc(source(t))}${isEdited(t)?'<div class="edited">Edited by you</div>':''}</td><td>${esc(effective(t))}</td><td>${esc(t.account)}</td><td class="amount ${t.amount>0?'positive':'negative'}">${fmt2(signed?t.amount:Math.abs(t.amount))}</td></tr>`).join('')}</tbody></table><div class="modaltotal"><span>Total</span><span>${fmt2(a.reduce((z,t)=>z+(signed?t.amount:Math.abs(t.amount)),0))}</span></div>`;m.showModal();$$('[data-detail-id]').forEach(e=>e.onclick=()=>{m.close();const t=findTx(e.dataset.detailId);if(t)openEditor(t)})}

function wire(){
 $$('[data-action]').forEach(e=>e.onclick=()=>openDetail(e.dataset.action,e.dataset.filter||''));
 $$('.txrow').forEach(e=>e.onclick=()=>{const t=findTx(e.dataset.id);if(t)openEditor(t)});
 const q=$('#search');if(q)q.oninput=()=>{search=q.value;render();const n=$('#search');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}};
 const cf=$('#categoryFilter');if(cf)cf.onchange=()=>{catFilter=cf.value;reviewOnly=false;render()};
 const hi=$('#hideInternal');if(hi)hi.onchange=()=>{hideInternal=hi.checked;localStorage.setItem('hideInternalTransfers',hideInternal?'1':'0');render()};
 const rn=$('#reviewNow');if(rn)rn.onclick=()=>{view='transactions';reviewOnly=true;catFilter='Needs Review';$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view==='transactions'));render()};
 $$('[data-delete-rule]').forEach(b=>b.onclick=()=>{deleteRule(b.dataset.deleteRule);render()});
}
function render(){const app=$('#app');app.innerHTML=view==='overview'?overview():view==='month'?monthView():view==='transactions'?transactions():view==='accounts'?accounts():rules();wire();updateUndoRedo()}

order.forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=D[k].label;sel.appendChild(o)});sel.value=latest;
const tabs=$('.tabs');if(!$('.tab[data-view="rules"]'))tabs.insertAdjacentHTML('beforeend','<button class="tab" data-view="rules">Rules</button>');
const controls=$('.controls');controls.insertAdjacentHTML('afterbegin','<button id="undoBtn" class="iconbtn" title="Undo last change">↶ Undo</button><button id="redoBtn" class="iconbtn" title="Redo last change">↷ Redo</button>');
$('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');view=b.dataset.view;reviewOnly=false;render()});
sel.onchange=()=>{search='';catFilter='All';reviewOnly=false;render()};
$('#closeModal').onclick=()=>$('#modal').close();
render();
const stamp=document.getElementById('dataVersion');if(stamp)stamp.textContent='Data through July 2026 · audited '+DATA_VERSION;
}catch(e){console.error(e);document.getElementById('app').innerHTML='<div class="card"><h2>Dashboard error</h2><p>'+String(e.message||e)+'</p></div>';}})();
