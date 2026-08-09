const fs=require('fs');const zlib=require('zlib');
const parts=[0,1,2,3,4].map(i=>fs.readFileSync(`data-v4-${i}.js`,'utf8'));
let b64='';for(const s of parts){const m=s.match(/\+"([A-Za-z0-9+/=]+)";?\s*$/);if(!m)throw new Error('Could not parse data chunk');b64+=m[1];}
const raw=zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
const data=JSON.parse(raw);
if(!Array.isArray(data.order)||!data.months||!Array.isArray(data.accounts)||!Array.isArray(data.merchants)||!Array.isArray(data.cats))throw new Error('Invalid dashboard data shape');
for(const k of data.order){const m=data.months[k];if(!m||!Array.isArray(m.tx)||!Array.isArray(m.sa)||!Array.isArray(m.ea))throw new Error(`Invalid month ${k}`);}
fs.writeFileSync('data-static.js','window.RAW_MONEY_DATA='+JSON.stringify(data)+';\n');
console.log(`Wrote data-static.js with ${data.order.length} months and ${data.order.reduce((n,k)=>n+data.months[k].tx.length,0)} transactions`);
