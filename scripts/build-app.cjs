const fs=require('fs');const zlib=require('zlib');
const packed=fs.readFileSync('app-v5.js','utf8');const m=packed.match(/atob\("([A-Za-z0-9+/=]+)"\)/);if(!m)throw new Error('Could not unpack app-v5.js');
let s=zlib.gunzipSync(Buffer.from(m[1],'base64')).toString('utf8');
// Production fixes: ordinary PayPal merchants are not P2P.
s=s.replace(/function isP2P\(t\)\{return \/VENMO\|ZELLE\|CASH \?APP\|APPLE CASH\|PERSON-TO-PERSON\|PAYPAL \\\*\(\?!UBER\|HBO\|MAX\|MCGRAW\)\/i\.test\(source\(t\)\)\}/,"function isP2P(t){return /VENMO|ZELLE|CASH ?APP|APPLE CASH|PERSON-TO-PERSON/i.test(source(t))}");
// Fixed categorization rules requested by the user.
s=s.replace(" const rule=merchantRule(t); if(rule)return rule;\n if(isP2P(t))return'Needs Review';"," const src=source(t).toUpperCase();\n if(/RENE\\s+VELEZ/.test(src))return'Gifts & Donations';\n if(/NETFLIX\\.COM/.test(src))return'Subscriptions & Digital';\n const rule=merchantRule(t); if(rule)return rule;\n if(isP2P(t))return'Needs Review';");
// Add the exact JetBlue statement balances supplied for Mar-Jul 2026.
const adds={
"2026-03":"{name:'Barclays JetBlue Plus',balance:0,asof:'Mar 26, 2026',status:'exact'}",
"2026-04":"{name:'Barclays JetBlue Plus',balance:1506.86,asof:'Apr 26, 2026',status:'exact'}",
"2026-05":"{name:'Barclays JetBlue Plus',balance:1231.91,asof:'May 26, 2026',status:'exact'}",
"2026-06":"{name:'Barclays JetBlue Plus',balance:1288.42,asof:'Jun 26, 2026',status:'exact'}",
"2026-07":"{name:'Barclays JetBlue Plus',balance:722.36,asof:'Jul 26, 2026',status:'exact'}"};
for(const [k,item] of Object.entries(adds)){
 const re=new RegExp("('"+k+"':\\[[^\\n]*?Members 1st Visa Signature'[^\\n]*?\\})\\]");
 if(!re.test(s))throw new Error('Could not patch JetBlue '+k);
 s=s.replace(re,`$1,${item}]`);
}
// Explicitly label the two credit-card values that were inferred rather than statement-confirmed.
s=s.replace("{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026'}","{name:'Capital One QuicksilverOne',balance:844.58,asof:'Mar 21, 2026',status:'inferred'}");
s=s.replace("{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026'}","{name:'Amazon / Chase',balance:925.35,asof:'Jun 4, 2026',status:'inferred'}");
// Avoid presenting incomplete card coverage as complete total debt.
s=s.replaceAll("card('Credit cards',fmt(","card('Known card balances',fmt(");
s=s.replace("<h2>Credit cards</h2>","<h2>Known card balances</h2>");
s=s.replace("title.textContent='Credit cards';","title.textContent='Known card balances';");
s=s.replace("<span>Total balance</span>","<span>Known balance total</span>");
// Show source quality in card details.
s=s.replace("<td>${c.asof}</td><td class=\"amount\">${fmt2(c.balance)}</td>","<td>${c.asof}${c.status==='inferred'?' · inferred':''}</td><td class=\"amount\">${fmt2(c.balance)}</td>");
s=s.replace("<div class=\"note\">As of ${c.asof}</div>","<div class=\"note\">As of ${c.asof}${c.status==='inferred'?' · inferred':''}</div>");
// Production data marker.
s=s.replace("const R=window.RAW_MONEY_DATA;","const R=window.RAW_MONEY_DATA;\nconst DATA_VERSION='2026-08-09';");
s=s.replace("render();\n}catch(e)","render();\nconst stamp=document.getElementById('dataVersion');if(stamp)stamp.textContent='Data through July 2026 · audited '+DATA_VERSION;\n}catch(e)");
fs.writeFileSync('app.js',s);
console.log('Wrote app.js',s.length,'bytes');
