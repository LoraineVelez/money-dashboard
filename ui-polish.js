(()=>{
  const style=document.createElement('style');
  style.id='ui-polish-v1';
  style.textContent=`
    #undoBtn,#redoBtn{width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;padding:0!important;border-radius:9px!important;display:inline-grid!important;place-items:center!important;font-size:17px!important;line-height:1!important;box-shadow:none!important;background:var(--surface)!important;color:var(--muted)!important;border:1px solid var(--line)!important}
    #undoBtn:hover:not(:disabled),#redoBtn:hover:not(:disabled){color:var(--ink)!important;border-color:var(--lagoon)!important;background:var(--lagoon-soft)!important}
    #undoBtn:disabled,#redoBtn:disabled{opacity:.32!important;cursor:not-allowed!important}
    #undoBtn:focus-visible,#redoBtn:focus-visible{outline:3px solid var(--focus)!important;outline-offset:2px!important}
    .txfilters{align-items:center}
    .txfilters button{white-space:nowrap}
    @media(max-width:600px){#undoBtn,#redoBtn{width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;font-size:16px!important}.txfilters{gap:6px!important}}
  `;
  document.head.appendChild(style);

  function polish(){
    const undo=document.getElementById('undoBtn');
    const redo=document.getElementById('redoBtn');
    if(undo){
      undo.textContent='↶';
      undo.setAttribute('aria-label','Undo last change');
      undo.setAttribute('title','Undo last change');
    }
    if(redo){
      redo.textContent='↷';
      redo.setAttribute('aria-label','Redo last change');
      redo.setAttribute('title','Redo last change');
    }
  }
  polish();
  new MutationObserver(polish).observe(document.body,{childList:true,subtree:true});
})();
