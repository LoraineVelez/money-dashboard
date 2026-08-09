// Authoritative Charter Oak statement reconciliation + live user-override calculations.
// Loaded after the existing app so the layout is untouched.
(() => {
  const AUTH = {
    '2025-11': {sa:[0.01,7145.74,1202.73], ea:[0.01,7731.67,0.00], start:8348.48, end:7731.68},
    '2025-12': {sa:[0.01,7731.67,0.00], ea:[0.01,14006.71,169.88], start:7731.68, end:14176.60},
    '2026-01': {sa:[0.01,14006.71,169.88], ea:[0.01,14607.70,531.69], start:14176.60, end:15139.40},
    '2026-02': {sa:[0.01,14607.70,531.69], ea:[0.01,14506.97,2268.05], start:15139.40, end:16775.03},
    '2026-03': {sa:[0.01,14506.97,2268.05], ea:[0.01,16007.72,670.30], start:16775.03, end:16678.03},
    '2026-04': {sa:[0.01,16007.72,670.30], ea:[0.01,18007.66,286.74], start:16678.03, end:18294.41},
    '2026-05': {sa:[0.01,18007.66,286.74], ea:[0.01,19508.53,1351.91], start:18294.41, end:20860.45},
    '2026-06': {sa:[0.01,19508.53,1351.91], ea:[0.01,19609.18,259.76], start:20860.45, end:19868.95},
    '2026-07': {sa:[0.01,19609.18,259.76], ea:[3000.03,20424.20,970.02], start:19868.95, end:24394.25}
  };
  const names=['Regular Savings','Bright Future Savings','Debit Account'];
  Object.entries(AUTH).forEach(([k,a])=>{
    const x=D[k]; if(!x) return;
    x.sa=[...a.sa]; x.ea=[...a.ea]; x.start=a.start; x.end=a.end; x.change=+(a.end-a.start).toFixed(2);
    x.startAccounts=Object.fromEntries(names.map((n,i)=>[n,a.sa[i]]));
    x.endAccounts=Object.fromEntries(names.map((n,i)=>[n,a.ea[i]]));
  });

  window.isInternalTransfer = function(t){
    const src=((t.description||'')+' '+(t.merchant||'')).toUpperCase();
    if((t.category||'')==='Internal Transfer') return true;
    return /(?:ONLINE BANKING )?TRANSFER (?:TO|FROM) SHARE (?:01|02|31)\b/.test(src);
  };
  window.isSpendingOutflow = function(t){
    if(t.amount>=0 || isInternalTransfer(t)) return false;
    return effectiveCategory(t)!=='Debt Payment';
  };
  window.computedIncome = function(x){
    return x.tx.filter(t=>t.amount>0&&!isInternalTransfer(t)).reduce((sum,t)=>sum+t.amount,0);
  };
  window.computedCategories = function(x){
    const out={};
    x.tx.forEach(t=>{
      if(!isSpendingOutflow(t)) return;
      const c=effectiveCategory(t);
      out[c]=(out[c]||0)+Math.abs(t.amount);
    });
    return out;
  };
  window.computedCategoryActivity = function(x){
    const out={};
    x.tx.forEach(t=>{
      if(isInternalTransfer(t)) return;
      const c=effectiveCategory(t);
      out[c]=(out[c]||0)+t.amount;
    });
    return out;
  };
  window.getRows = function(action,filter){
    const x=D[sel.value];
    if(action==='income') return x.tx.filter(t=>t.amount>0&&!isInternalTransfer(t));
    if(action==='spending') return x.tx.filter(t=>isSpendingOutflow(t));
    if(action==='cards') return x.tx.filter(t=>effectiveCategory(t)==='Debt Payment');
    if(action==='category') return x.tx.filter(t=>!isInternalTransfer(t)&&effectiveCategory(t)===filter);
    if(action==='allIncome') return order.flatMap(m=>D[m].tx.filter(t=>t.amount>0&&!isInternalTransfer(t)));
    if(action==='allSpending') return order.flatMap(m=>D[m].tx.filter(t=>isSpendingOutflow(t)));
    return [];
  };

  const originalRender=render;
  window.render=function(){
    order.forEach(k=>{D[k].spend=Object.values(computedCategories(D[k])).reduce((a,b)=>a+b,0);});
    originalRender();
  };
  render();
})();
