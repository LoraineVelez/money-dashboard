const fs=require('fs');const vm=require('vm');
const src=fs.readFileSync('data-static.js','utf8');const box={window:{}};vm.runInNewContext(src,box);const R=box.window.RAW_MONEY_DATA;
const expected={
'2025-11':{start:8348.48,end:7731.68,ea:[0.01,7731.67,0]},
'2025-12':{start:7731.68,end:14176.60,ea:[0.01,14006.71,169.88]},
'2026-01':{start:14176.60,end:15139.40,ea:[0.01,14607.70,531.69]},
'2026-02':{start:15139.40,end:16775.03,ea:[0.01,14506.97,2268.05]},
'2026-03':{start:16775.03,end:16678.03,ea:[0.01,16007.72,670.30]},
'2026-04':{start:16678.03,end:18294.41,ea:[0.01,18007.66,286.74]},
'2026-05':{start:18294.41,end:20860.45,ea:[0.01,19508.53,1351.91]},
'2026-06':{start:20860.45,end:19868.95,ea:[0.01,19609.18,259.76]},
'2026-07':{start:19868.95,end:24394.25,ea:[3000.03,20424.20,970.02]}};
const near=(a,b)=>Math.abs(Number(a)-Number(b))<0.02;let failures=[];
for(const k of R.order){const m=R.months[k],e=expected[k];if(!e){failures.push(`${k}: unexpected month`);continue;}if(!near(m.start,e.start))failures.push(`${k}: start ${m.start} != ${e.start}`);if(!near(m.end,e.end))failures.push(`${k}: end ${m.end} != ${e.end}`);e.ea.forEach((v,i)=>{if(!near(m.ea[i],v))failures.push(`${k}: ending account ${i} ${m.ea[i]} != ${v}`)});const sum=m.tx.reduce((a,t)=>a+Number(t[3]),0);if(!near(m.start+sum,m.end))failures.push(`${k}: transaction reconciliation diff ${(m.end-(m.start+sum)).toFixed(2)}`);}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log('Data audit passed: balances and transaction rollups reconcile for all months.');
