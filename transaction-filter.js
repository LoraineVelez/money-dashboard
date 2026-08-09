(()=>{
  const state={hideInternal:localStorage.getItem('hideInternalTransfers')==='true'};

  function isInternalRow(row){
    const cells=row.querySelectorAll('td');
    if(cells.length<2)return false;
    const text=(cells[1].textContent||'').toUpperCase();
    return /(?:ONLINE BANKING )?TRANSFER (?:TO|FROM) SHARE (?:01|02|31)\b/.test(text);
  }

  function applyFilter(){
    document.querySelectorAll('.txcard tbody tr').forEach(row=>{
      row.style.display=state.hideInternal&&isInternalRow(row)?'none':'';
    });
  }

  function addControl(){
    const card=document.querySelector('.txcard');
    const head=card?.querySelector('.txhead');
    if(!card||!head)return;

    let wrap=head.querySelector('.internal-filter-wrap');
    if(!wrap){
      wrap=document.createElement('label');
      wrap.className='internal-filter-wrap';
      wrap.style.cssText='display:flex;align-items:center;gap:8px;font-size:13px;color:#746d70;cursor:pointer;user-select:none;';
      wrap.innerHTML='<input id="hideInternalTransfers" type="checkbox" style="width:16px;height:16px;accent-color:#c78998;cursor:pointer;margin:0;"> <span>Hide internal transfers</span>';
      const search=head.querySelector('#search');
      if(search){
        const tools=document.createElement('div');
        tools.className='tx-filter-tools';
        tools.style.cssText='display:flex;align-items:center;gap:14px;flex-wrap:wrap;';
        search.parentNode.insertBefore(tools,search);
        tools.appendChild(wrap);
        tools.appendChild(search);
      }else head.appendChild(wrap);
      const cb=wrap.querySelector('#hideInternalTransfers');
      cb.checked=state.hideInternal;
      cb.addEventListener('change',()=>{
        state.hideInternal=cb.checked;
        localStorage.setItem('hideInternalTransfers',String(state.hideInternal));
        applyFilter();
      });
    }else{
      const cb=wrap.querySelector('#hideInternalTransfers');
      if(cb)cb.checked=state.hideInternal;
    }
    applyFilter();
  }

  const observer=new MutationObserver(()=>addControl());
  observer.observe(document.getElementById('app'),{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',addControl);
  addControl();
})();