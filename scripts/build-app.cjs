const fs=require('fs');const zlib=require('zlib');
const packed=fs.readFileSync('app-v5.js','utf8');const m=packed.match(/atob\("([A-Za-z0-9+/=]+)"\)/);if(!m)throw new Error('Could not unpack app-v5.js');
let s=zlib.gunzipSync(Buffer.from(m[1],'base64')).toString('utf8');
function mustReplace(label,re,repl){const before=s;s=s.replace(re,repl);if(s===before)throw new Error('Patch failed: '+label);}
// Static data: production no longer decompresses financial data in the browser.
mustReplace('runtime data decompression',/\(async\(\)=>\{try\{\nconst \$=s=>document\.querySelector\(s\), \$\$=s=>\[\.\.\.document\.querySelectorAll\(s\)\];\nconst b=atob\(window\.DATA_GZ\|\|""\);const bytes=new Uint8Array\(b\.length\);for\(let i=0;i<b\.length;i\+\+\)bytes\[i\]=b\.charCodeAt\(i\);\nconst ds=new DecompressionStream\("gzip"\);const txt=await new Response\(new Blob\(\[bytes\]\)\.stream\(\)\.pipeThrough\(ds\)\)\.text\(\);\nconst R=JSON\.parse\(txt\);/,()=>"(()=>{try{\nconst $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];\nconst R=window.RAW_MONEY_DATA;if(!R)throw new Error('Dashboard data failed to load');\nconst DATA_VERSION='2026-08-09';");
// Remove the duplicate hard-coded bank-balance override. The audited data file is the source of truth.
mustReplace('duplicate verified balances',/\nconst VERIFIED=\{[\s\S]*?\n\};\nconst DATA=\{order:R\.order,months:\{\}\};/,"\nconst DATA={order:R.order,months:{}};");
mustReplace('verified map lookup'," const x=R.months[k],v=VERIFIED[k]||{};"," const x=R.months[k];");
mustReplace('verified start-end override'," DATA.months[k]={...x,start:v.start??x.start,end:v.end??x.end,"," DATA.months[k]={...x,start:x.start,end:x.end,");
s=s.replaceAll("(v.ea||x.ea)","x.ea");
// Ordinary PayPal merchants are purchases, not automatically peer-to-peer.
mustReplace('P2P classifier',/function isP2P\(t\)\{return \/VENMO\|ZELLE\|CASH \?APP\|APPLE CASH\|PERSON-TO-PERSON\|PAYPAL \\\*\(\?!UBER\|HBO\|MAX\|MCGRAW\)\/i\.test\(source\(t\)\)\}/,"function isP2P(t){return /VENMO|ZELLE|CASH ?APP|APPLE CASH|PERSON-TO-PERSON/i.test(source(t))}");
// Fixed rules have explicit priority after a transaction-specific manual override.
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
// Add exact JetBlue statement balances supplied for Mar-Jul 2026.
const adds={
"2026-03":"{name:'Barclays JetBlue Plus',balance:0,asof:'Mar 26, 2026',status:'exact'}",
"2026-04":"{name:'Barclays JetBlue Plus',balance:1506.86,asof:'Apr 26, 2026',status:'exact'}",
"2026-05":"{name:'Barclays JetBlue Plus',balance:1231.91,asof:'May 26, 2026',status:'exact'}",
"2026-06":"{name:'Barclays JetBlue Plus',balance:1288.42,asof:'Jun 26, 2026',status:'exact'}",
"2026-07":"{name:'Barclays JetBlue Plus',balance:722.36,asof:'Jul 26, 2026',status:'exact'}"};
for(const [k,item] of Object.entries(adds)){const re=new RegExp("('"+k+"':\\[[^\\n]*?Members 1st Visa Signature'[^\\n]*?\\})\\]");if(!re.test(s))throw new Error('Could not patch JetBlue '+k);s=s.replace(re,`$1,${item}]`);}
// Mark the two balances that were inferred rather than statement-confirmed.
mustReplace('Capital One inferred flag',"{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026'}","{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026',status:'inferred'}");
mustReplace('Amazon inferred flag',"{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026'}","{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026',status:'inferred'}");
// Do not imply incomplete credit-card coverage is a complete debt total.
s=s.replaceAll("card('Credit cards',fmt(","card('Known card balances',fmt(");
s=s.replaceAll('<h2>Credit cards</h2>','<h2>Known card balances</h2>');
s=s.replaceAll("title.textContent='Credit cards';","title.textContent='Known card balances';");
s=s.replaceAll('<span>Total balance</span>','<span>Known balance total</span>');
s=s.replaceAll(" from previous month`}"," in known balances from previous month`}");
s=s.replaceAll("'No change from previous month'","'No change in known balances from previous month'");
s=s.replaceAll("<td>${c.asof}</td><td class=\"amount\">${fmt2(c.balance)}</td>","<td>${c.asof}${c.status==='inferred'?' · inferred':''}</td><td class=\"amount\">${fmt2(c.balance)}</td>");
s=s.replaceAll("<div class=\"note\">As of ${c.asof}</div>","<div class=\"note\">As of ${c.asof}${c.status==='inferred'?' · inferred':''}</div>");
// Auto-loan payment count is a rough estimate because interest affects amortization.
s=s.replaceAll(" · about ${Math.ceil(auto/AUTO_PAYMENT)} payments left"," · roughly ${Math.ceil(auto/AUTO_PAYMENT)} payments at ${fmt2(AUTO_PAYMENT)} (ignores interest)");
s=s.replaceAll("card('Payments left','~'+Math.ceil(AUTOLOAN.at(-1).balance/AUTO_PAYMENT))","card('Rough payments','~'+Math.ceil(AUTOLOAN.at(-1).balance/AUTO_PAYMENT),'Ignores interest')");
// Data-version marker.
mustReplace('data version stamp',/render\(\);\n\}\s*catch\(e\)/,"render();\nconst stamp=document.getElementById('dataVersion');if(stamp)stamp.textContent='Data through July 2026 · audited '+DATA_VERSION;\n}catch(e)");
if(/DecompressionStream|DATA_GZ/.test(s))throw new Error('Runtime decompression still present in app.js');
if(/const VERIFIED=/.test(s))throw new Error('Duplicate hard-coded bank balances still present');
if(!/RENE\\s\+VELEZ/.test(s)||!/NETFLIX\\\.COM/.test(s))throw new Error('Fixed categorization rules missing');
fs.writeFileSync('app.js',s);console.log('Wrote app.js',s.length,'bytes');
