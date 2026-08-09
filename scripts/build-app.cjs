const fs=require('fs');const zlib=require('zlib');
const packed=fs.readFileSync('app-v5.js','utf8');const m=packed.match(/atob\("([A-Za-z0-9+/=]+)"\)/);if(!m)throw new Error('Could not unpack app-v5.js');
let s=zlib.gunzipSync(Buffer.from(m[1],'base64')).toString('utf8');
function mustReplace(label,re,repl){const before=s;s=s.replace(re,repl);if(s===before)throw new Error('Patch failed: '+label);}
mustReplace('runtime data decompression',/\(async\(\)=>\{try\{\nconst \$=s=>document\.querySelector\(s\), \$\$=s=>\[\.\.\.document\.querySelectorAll\(s\)\];\nconst b=atob\(window\.DATA_GZ\|\|""\);const bytes=new Uint8Array\(b\.length\);for\(let i=0;i<b\.length;i\+\+\)bytes\[i\]=b\.charCodeAt\(i\);\nconst ds=new DecompressionStream\("gzip"\);const txt=await new Response\(new Blob\(\[bytes\]\)\.stream\(\)\.pipeThrough\(ds\)\)\.text\(\);\nconst R=JSON\.parse\(txt\);/,()=>"(()=>{try{\nconst $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];\nconst R=window.RAW_MONEY_DATA;if(!R)throw new Error('Dashboard data failed to load');\nconst DATA_VERSION='2026-08-09';");
mustReplace('duplicate verified balances',/\nconst VERIFIED=\{[\s\S]*?\n\};\nconst DATA=\{order:R\.order,months:\{\}\};/,"\nconst DATA={order:R.order,months:{}};");
mustReplace('verified map lookup'," const x=R.months[k],v=VERIFIED[k]||{};"," const x=R.months[k];");
mustReplace('verified start-end override'," DATA.months[k]={...x,start:v.start??x.start,end:v.end??x.end,"," DATA.months[k]={...x,start:x.start,end:x.end,");
s=s.replaceAll("(v.ea||x.ea)","x.ea");
mustReplace('P2P classifier',/function isP2P\(t\)\{return \/VENMO\|ZELLE\|CASH \?APP\|APPLE CASH\|PERSON-TO-PERSON\|PAYPAL \\\*\(\?!UBER\|HBO\|MAX\|MCGRAW\)\/i\.test\(source\(t\)\)\}/,"function isP2P(t){return /VENMO|ZELLE|CASH ?APP|APPLE CASH|PERSON-TO-PERSON/i.test(source(t))}");
mustReplace('effective categorization',/function effective\(t\)\{[\s\S]*?\n\}\nfunction isEdited/,`function effective(t){
 const one=manualOverride(t); if(one)return one;
 const src=source(t).toUpperCase();
 if(/RENE\\s+VELEZ/.test(src))return'Gifts & Donations';
 if(/NETFLIX\\.COM/.test(src))return'Subscriptions & Digital';
 const rule=merchantRule(t); if(rule)return rule;
 if(isP2P(t))return'Needs Review';
 if(/JWALES|JOHNSON.*WALES/.test(src))return'Education';
 if(/WHOLE ?FOODS/.test(src))return'Groceries & Dining';
 if(/AMAZON PRIME/.test(src))return'Subscriptions & Digital';
 if(/AMAZON|AMZN/.test(src))return'Shopping';
 if(t.amount<0&&Math.abs(Math.abs(t.amount)-350)<.01&&/MEMBERS ?1ST|MEMBERS FIRST/.test(src))return'Vehicle & Transportation';
 return canonical(t.category);
}
function isEdited`);
const adds={
"2026-03":"{name:'Barclays JetBlue Plus',balance:0,asof:'Mar 26, 2026',status:'exact'}",
"2026-04":"{name:'Barclays JetBlue Plus',balance:1506.86,asof:'Apr 26, 2026',status:'exact'}",
"2026-05":"{name:'Barclays JetBlue Plus',balance:1231.91,asof:'May 26, 2026',status:'exact'}",
"2026-06":"{name:'Barclays JetBlue Plus',balance:1288.42,asof:'Jun 26, 2026',status:'exact'}",
"2026-07":"{name:'Barclays JetBlue Plus',balance:722.36,asof:'Jul 26, 2026',status:'exact'}"};
for(const [k,item] of Object.entries(adds)){const re=new RegExp("('"+k+"':\\[[^\\n]*?Members 1st Visa Signature'[^\\n]*?\\})\\]");if(!re.test(s))throw new Error('Could not patch JetBlue '+k);s=s.replace(re,`$1,${item}]`);}
mustReplace('Capital One inferred flag',"{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026'}","{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026',status:'inferred'}");
mustReplace('Amazon inferred flag',"{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026'}","{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026',status:'inferred'}");
s=s.replaceAll("card('Credit cards',fmt(","card('Known card balances',fmt(");
s=s.replaceAll('<h2>Credit cards</h2>','<h2>Known card balances</h2>');
s=s.replaceAll("title.textContent='Credit cards';","title.textContent='Known card balances';");
s=s.replaceAll('<span>Total balance</span>','<span>Known balance total</span>');
s=s.replaceAll(" from previous month`}"," in known balances from previous month`}");
s=s.replaceAll("'No change from previous month'","'No change in known balances from previous month'");
s=s.replaceAll("<td>${c.asof}</td><td class=\"amount\">${fmt2(c.balance)}</td>","<td>${c.asof}${c.status==='inferred'?' · inferred':''}</td><td class=\"amount\">${fmt2(c.balance)}</td>");
s=s.replaceAll("<div class=\"note\">As of ${c.asof}</div>","<div class=\"note\">As of ${c.asof}${c.status==='inferred'?' · inferred':''}</div>");
s=s.replaceAll(" · ${Math.ceil(auto/AUTO_PAYMENT)} payments left"," · roughly ${Math.ceil(auto/AUTO_PAYMENT)} payments at ${fmt2(AUTO_PAYMENT)} (ignores interest)");
s=s.replaceAll(" · about ${Math.ceil(auto/AUTO_PAYMENT)} payments left"," · roughly ${Math.ceil(auto/AUTO_PAYMENT)} payments at ${fmt2(AUTO_PAYMENT)} (ignores interest)");
s=s.replaceAll("card('Payments left','~'+Math.ceil(AUTOLOAN.at(-1).balance/AUTO_PAYMENT))","card('Rough payments','~'+Math.ceil(AUTOLOAN.at(-1).balance/AUTO_PAYMENT),'Ignores interest')");

mustReplace('tropical pie colors',/const colors=\[[^\n]+\];/,"const colors=['#3b9a91','#e88172','#e2a84f','#4f8c68','#a66d8f','#5f8fb7','#62b7a8','#f09b78','#d2bd68','#7da67c','#bd7e9e','#6fa4b2'];");
s=s.replaceAll('<circle cx="150" cy="150" r="64" fill="#fff" pointer-events="none"/>','<circle cx="150" cy="150" r="64" fill="var(--surface)" pointer-events="none"/>');
s=s.replaceAll('<text x="150" y="144" text-anchor="middle" font-size="13" fill="#746d70">','<text x="150" y="144" text-anchor="middle" font-size="13" fill="var(--muted)">');
s=s.replaceAll('<text x="150" y="166" text-anchor="middle" font-size="20" font-weight="700">','<text x="150" y="166" text-anchor="middle" font-size="20" font-weight="700" fill="var(--ink)">');

const recurringCode=`
const BILL_CATS=new Set(['Housing','Bills & Utilities','Subscriptions & Digital','Vehicle & Transportation','Health','Education']);
let upcomingCursor=new Date();upcomingCursor=new Date(upcomingCursor.getFullYear(),upcomingCursor.getMonth(),1);
const median=a=>{const b=a.slice().sort((x,y)=>x-y),n=b.length;return n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2};
function billName(key){return key.toLowerCase().replace(/\\b\\w/g,c=>c.toUpperCase()).replace(/\\s+/g,' ').trim()}
function recurringBills(){
 const groups={};
 order.forEach(k=>D[k].tx.forEach(t=>{if(t.amount>=0||internal(t)||isP2P(t)||debtPayment(t))return;const c=effective(t);if(!BILL_CATS.has(c))return;const key=normalizeMerchant(source(t));if(!key||/CASH ?APP|VENMO|ZELLE|PERSON-TO-PERSON/i.test(key))return;(groups[key]??=[]).push({...t,_cat:c,_month:k})}));
 return Object.entries(groups).map(([key,rows])=>{const months=[...new Set(rows.map(r=>r._month))];if(months.length<3)return null;const days=rows.map(r=>+r.date.slice(-2)),amounts=rows.map(r=>Math.abs(r.amount)),cats={};rows.forEach(r=>cats[r._cat]=(cats[r._cat]||0)+1);const cat=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0][0],day=Math.round(median(days)),amount=median(amounts),daySpread=Math.max(...days)-Math.min(...days);if(cat!=='Bills & Utilities'&&cat!=='Housing'&&cat!=='Subscriptions & Digital'&&daySpread>10)return null;return{key,name:billName(key),category:cat,day,amount,months:months.length,last:rows.slice().sort((a,b)=>b.date.localeCompare(a.date))[0]}}).filter(Boolean).sort((a,b)=>a.day-b.day||a.name.localeCompare(b.name));
}
function billDate(b,cursor){const y=cursor.getFullYear(),m=cursor.getMonth(),last=new Date(y,m+1,0).getDate(),saved=localStorage.getItem('billDue:'+b.key),d=saved?+saved:Math.min(b.day,last);return new Date(y,m,Math.max(1,Math.min(d,last)))}
function billMonthKey(cursor){return cursor.getFullYear()+'-'+String(cursor.getMonth()+1).padStart(2,'0')}
function billPaidKey(b,cursor){return'billPaid:'+billMonthKey(cursor)+':'+b.key}
function isBillPaid(b,cursor){return localStorage.getItem(billPaidKey(b,cursor))==='1'}
function billTone(c){return c==='Housing'?'coral':c==='Bills & Utilities'?'lagoon':c==='Subscriptions & Digital'?'orchid':c==='Vehicle & Transportation'?'mango':c==='Health'?'palm':'sky'}
function upcomingItems(){return recurringBills().map(b=>({...b,due:billDate(b,upcomingCursor),paid:isBillPaid(b,upcomingCursor)}))}
function calendarHTML(items){const y=upcomingCursor.getFullYear(),m=upcomingCursor.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),by={};items.forEach(b=>{const d=b.due.getDate();(by[d]??=[]).push(b)});let cells='';for(let i=0;i<first;i++)cells+='<div class="calday blank"></div>';for(let d=1;d<=days;d++){const bills=by[d]||[];cells+=\`<div class="calday \\${bills.length?'hasbills':''}"><span class="daynum">\\${d}</span>\\${bills.map(b=>\`<div class="calevent \\${b.paid?'paid':''}" style="--event:var(--\\${billTone(b.category)})" title="\\${esc(b.name)} · \\${fmt2(b.amount)}"><span></span><small>\\${esc(b.name)}</small></div>\`).join('')}</div>\`}return cells}
function upcoming(){const items=upcomingItems(),label=new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(upcomingCursor),unpaid=items.filter(x=>!x.paid),total=unpaid.reduce((a,b)=>a+b.amount,0);return\`<div class="upcominghead"><div><h2>Upcoming · \\${label}</h2><div class="muted">Recurring bills and subscriptions inferred from statement patterns. Amounts are typical, not guaranteed.</div></div><div class="upnav"><button class="smallbtn" id="upPrev" aria-label="Previous month">‹</button><button class="smallbtn" id="upToday">This month</button><button class="smallbtn" id="upNext" aria-label="Next month">›</button></div></div><div class="grid4 upcomingstats">\\${card('Recurring items',String(items.length),'Detected from 3+ statement months')}\\${card('Still due',String(unpaid.length),'Not marked paid')}\\${card('Typical remaining',fmt(total),'Based on historical recurring amounts')}\\${card('Paid',String(items.length-unpaid.length),'Marked paid for this month')}</div><div class="two section upcominglayout"><div class="card"><div class="calendarweek"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="calendargrid">\\${calendarHTML(items)}</div></div><div class="card"><h2>Upcoming reminders</h2>\\${items.length?items.map(b=>{const iso=b.due.getFullYear()+'-'+String(b.due.getMonth()+1).padStart(2,'0')+'-'+String(b.due.getDate()).padStart(2,'0'),tone=billTone(b.category);return\`<div class="billrow \\${b.paid?'ispaid':''}" style="--bill:var(--\\${tone})"><div class="billmain"><span class="billdot"></span><div><strong>\\${esc(b.name)}</strong><div class="note">\\${esc(b.category)} · usually \\${fmt2(b.amount)} · seen in \\${b.months} months</div></div></div><div class="billactions"><label class="duelabel">Due <input class="dueinput" data-bill-key="\\${esc(b.key)}" type="date" value="\\${iso}"></label><button class="smallbtn paidbtn" data-paid-key="\\${esc(b.key)}">\\${b.paid?'Undo paid':'Mark paid'}</button></div></div>\`}).join(''):'<div class="empty">No reliable recurring bills detected yet.</div>'}</div></div>\`}
`;
mustReplace('insert recurring engine',/function creditTrend\(k\)\{[^\n]+\}\n/,m=>m+'\n'+recurringCode+'\n');
mustReplace('insert upcoming view',/\nfunction rules\(\)\{/,"\n"+`function __UPCOMING_PLACEHOLDER__(){}`+"\nfunction rules(){");
s=s.replace('function __UPCOMING_PLACEHOLDER__(){}','');
mustReplace('upcoming render route',"function render(){const app=$('#app');app.innerHTML=view==='overview'?overview():view==='month'?monthView():view==='transactions'?transactions():view==='accounts'?accounts():rules();wire();updateUndoRedo()}","function render(){const app=$('#app');document.body.classList.toggle('upcoming-view',view==='upcoming');app.innerHTML=view==='overview'?overview():view==='month'?monthView():view==='transactions'?transactions():view==='accounts'?accounts():view==='upcoming'?upcoming():rules();wire();updateUndoRedo()}");
mustReplace('insert upcoming tab',"const tabs=$('.tabs');if(!$('.tab[data-view=\"rules\"]'))tabs.insertAdjacentHTML('beforeend','<button class=\"tab\" data-view=\"rules\">Rules</button>');","const tabs=$('.tabs');if(!$('.tab[data-view=\"upcoming\"]'))tabs.insertAdjacentHTML('beforeend','<button class=\"tab\" data-view=\"upcoming\">Upcoming</button>');if(!$('.tab[data-view=\"rules\"]'))tabs.insertAdjacentHTML('beforeend','<button class=\"tab\" data-view=\"rules\">Rules</button>');");
mustReplace('wire upcoming controls',/ \$\$\('\[data-delete-rule\]'\)\.forEach\(b=>b\.onclick=\(\)=>\{deleteRule\(b\.dataset\.deleteRule\);render\(\)\}\);\n\}/,` $$('[data-delete-rule]').forEach(b=>b.onclick=()=>{deleteRule(b.dataset.deleteRule);render()});
 const prev=$('#upPrev'),next=$('#upNext'),today=$('#upToday');
 if(prev)prev.onclick=()=>{upcomingCursor=new Date(upcomingCursor.getFullYear(),upcomingCursor.getMonth()-1,1);render()};
 if(next)next.onclick=()=>{upcomingCursor=new Date(upcomingCursor.getFullYear(),upcomingCursor.getMonth()+1,1);render()};
 if(today)today.onclick=()=>{const n=new Date();upcomingCursor=new Date(n.getFullYear(),n.getMonth(),1);render()};
 $$('.dueinput').forEach(i=>i.onchange=()=>{const d=new Date(i.value+'T12:00:00');if(!Number.isNaN(d.getTime())){localStorage.setItem('billDue:'+i.dataset.billKey,String(d.getDate()));render()}});
 $$('.paidbtn').forEach(b=>b.onclick=()=>{const bill=recurringBills().find(x=>x.key===b.dataset.paidKey);if(!bill)return;const k=billPaidKey(bill,upcomingCursor);if(localStorage.getItem(k)==='1')localStorage.removeItem(k);else localStorage.setItem(k,'1');render()});
}`);

mustReplace('data version stamp',/render\(\);\n\}\s*catch\(e\)/,"render();\nconst stamp=document.getElementById('dataVersion');if(stamp)stamp.textContent='Data through July 2026 · audited '+DATA_VERSION;\n}catch(e)");
if(/DecompressionStream|DATA_GZ/.test(s))throw new Error('Runtime decompression still present in app.js');
if(/const VERIFIED=/.test(s))throw new Error('Duplicate hard-coded bank balances still present');
if(/payments left/.test(s))throw new Error('Unqualified loan payment estimate still present');
if(!/RENE\\s\+VELEZ/.test(s)||!/NETFLIX\\\.COM/.test(s))throw new Error('Fixed categorization rules missing');
if(!/function upcoming\(\)/.test(s)||!/Mark paid/.test(s))throw new Error('Upcoming recurring view missing');
fs.writeFileSync('app.js',s);console.log('Wrote app.js',s.length,'bytes');
