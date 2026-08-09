(()=>{
  const style=document.createElement('style');
  style.id='ui-polish-v2';
  style.textContent=`
    /* Global rhythm and type */
    body{line-height:1.45;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    .wrap{max-width:1200px!important;padding:32px 24px 56px!important}
    h1{font-size:clamp(27px,3vw,34px)!important;letter-spacing:-.045em!important}
    h2{font-size:18px!important;line-height:1.25!important;margin-bottom:12px!important}
    .muted,.note{line-height:1.45}
    .label{letter-spacing:.015em!important}
    .value{font-variant-numeric:tabular-nums;line-height:1.08!important}

    /* Header and primary controls */
    .head{align-items:center!important;gap:20px!important}
    .brandline{gap:11px!important}
    .brandmark{flex:0 0 auto}
    .controls{gap:7px!important;align-items:center!important}
    .controls>label{font-size:11px!important;font-weight:700!important;letter-spacing:.02em}
    .controls select{min-width:156px}
    select,input{box-shadow:0 1px 0 rgba(20,35,30,.02);transition:border-color .15s,box-shadow .15s,background .15s}
    select:hover,input:hover{border-color:color-mix(in srgb,var(--lagoon) 42%,var(--line))}
    select:focus,input:focus{border-color:var(--lagoon);box-shadow:0 0 0 3px color-mix(in srgb,var(--lagoon) 13%,transparent)}
    .themebtn{min-height:40px!important;padding:8px 11px!important;box-shadow:none!important;font-size:13px!important}

    /* Compact history controls */
    #undoBtn,#redoBtn{width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;padding:0!important;border-radius:8px!important;display:inline-grid!important;place-items:center!important;font-size:16px!important;line-height:1!important;box-shadow:none!important;background:var(--surface)!important;color:var(--muted)!important;border:1px solid var(--line)!important}
    #undoBtn:hover:not(:disabled),#redoBtn:hover:not(:disabled){color:var(--ink)!important;border-color:var(--lagoon)!important;background:var(--lagoon-soft)!important}
    #undoBtn:disabled,#redoBtn:disabled{opacity:.28!important;cursor:not-allowed!important}
    #undoBtn:focus-visible,#redoBtn:focus-visible{outline:3px solid var(--focus)!important;outline-offset:2px!important}

    /* Navigation */
    .tabs{gap:7px!important;margin:22px 0 20px!important;padding-bottom:1px}
    .tab{padding:8px 14px!important;font-size:13px!important;font-weight:650!important;border-radius:999px!important;transition:background .15s,border-color .15s,color .15s,transform .15s}
    .tab:hover:not(.active){border-color:color-mix(in srgb,var(--lagoon) 45%,var(--line));background:var(--lagoon-soft)}
    .tab.active{font-weight:750!important;box-shadow:0 4px 12px color-mix(in srgb,var(--ink) 10%,transparent)}

    /* Cards and content hierarchy */
    .grid4{gap:14px!important}
    .card{border-radius:18px!important;padding:18px!important;box-shadow:0 8px 26px rgba(34,55,48,.055)!important}
    html[data-theme="dark"] .card{box-shadow:0 10px 28px rgba(0,0,0,.16)!important}
    .section{margin-top:16px!important}
    .two{gap:14px!important}
    .summaryline{margin-top:12px!important;padding:13px 15px!important;border-radius:13px!important}
    .callout{border-radius:13px!important;line-height:1.45}
    .pill{font-size:11px!important;font-weight:650!important;padding:4px 8px!important}
    .clickable:hover{transform:translateY(-1px)!important;box-shadow:0 12px 28px rgba(39,101,92,.09)!important}

    /* Review / cleanup bar */
    .reviewbar{padding:11px 13px!important;margin-bottom:13px!important;border-radius:14px!important;box-shadow:none!important}
    .reviewbtn{font-size:12px!important;padding:7px 10px!important;font-weight:650}
    .progresswrap{min-width:280px!important;gap:9px!important}
    .progress{height:7px!important}

    /* Charts */
    .piebox{min-height:300px!important;padding:4px 0}
    .piebox svg{max-width:360px;margin:auto;display:block}
    .pielegend{gap:5px 8px!important;margin-top:4px}
    .legendbtn{padding:7px 8px!important;border-radius:9px!important;font-size:12px!important;min-width:0}
    .legendbtn strong{font-size:11px;white-space:nowrap;font-variant-numeric:tabular-nums}
    .legendbtn span:nth-child(2){min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .legenddot{width:9px!important;height:9px!important}
    .card.section>svg{display:block;overflow:visible}
    .card.section>svg text{font-family:inherit}

    /* Tables and transaction controls */
    .txcard{margin-top:16px!important}
    .txhead{gap:12px!important}
    .txfilters{align-items:center!important;gap:7px!important}
    .txfilters input,.txfilters select{min-height:38px!important;padding:8px 10px!important;border-radius:10px!important;font-size:12px!important}
    .txfilters input{min-width:220px}
    .check{min-height:38px!important;padding:7px 9px!important;border-radius:10px!important;font-size:12px!important;white-space:nowrap}
    .check input{min-height:auto!important;accent-color:var(--lagoon)}
    .tablewrap{margin-top:12px!important;border:1px solid var(--line);border-radius:12px!important;background:var(--surface)}
    table{font-size:12px!important}
    th{font-size:10px!important;text-transform:uppercase;letter-spacing:.045em;font-weight:750!important}
    th,td{padding:10px 11px!important}
    tbody tr:last-child td{border-bottom:0}
    tbody tr:hover td{background:color-mix(in srgb,var(--lagoon-soft) 40%,var(--surface))}
    .amount{font-variant-numeric:tabular-nums}
    .categoryrow{padding:10px 6px!important;font-size:13px!important}
    .accountrow{padding:10px 0!important;font-size:13px}

    /* Modals */
    .modal{max-width:760px!important;border-radius:18px!important;box-shadow:0 24px 70px rgba(15,25,22,.26)!important}
    .modalhead{padding:18px 20px!important}
    .modalbody{padding:0 20px 20px!important}
    .close{width:32px!important;height:32px!important;font-size:17px!important;box-shadow:none}
    .editor{padding:14px 0!important}
    .scopebox{border:1px solid var(--line);padding:11px!important}
    .primarybtn{min-height:38px;padding:9px 14px!important;border-radius:9px!important}

    /* Upcoming */
    .upcominghead{margin-bottom:12px!important;gap:14px!important}
    .upcominghead h2{font-size:20px!important;margin-bottom:4px!important}
    .upnav{gap:6px!important}
    .scanbtn{min-height:34px!important;padding:7px 10px!important;border-radius:9px!important}
    .upnav .smallbtn{min-height:34px!important;padding:7px 10px!important;border-radius:9px!important;font-size:12px!important}
    .upcomingstats{gap:12px!important}
    .calendarweek,.calendargrid{gap:5px!important}
    .calendarweek{font-size:10px!important;margin-bottom:5px!important}
    .calday{min-height:82px!important;border-radius:10px!important;padding:6px!important}
    .daynum{margin-bottom:4px!important}
    .calevent{margin:2px 0!important}
    .reminderpanel{min-width:0}
    .paneltitle{margin-bottom:4px}
    .reminderlist{max-height:520px!important;padding-right:5px!important}
    .billrow{padding:12px 0!important;gap:12px!important}
    .billmain{gap:9px!important}
    .billmain strong{font-size:13px!important;line-height:1.3}
    .billusually{font-size:11px!important;margin-top:2px!important}
    .billmain .note{font-size:10px!important;margin-top:1px!important}
    .billactions{gap:5px!important}
    .duelabel{gap:5px!important}
    .dueinput{width:124px!important;min-height:29px!important;padding:4px 6px!important;font-size:10px!important;border-radius:7px!important}
    .paidbtn,.removebill{width:28px!important;height:28px!important;font-size:14px!important}

    /* AI review */
    .aireview{padding:16px!important;border-radius:18px!important;box-shadow:0 8px 26px rgba(34,55,48,.05)!important}
    .aihead{margin-bottom:12px!important;gap:14px!important}
    .aibadge{width:31px!important;height:31px!important;border-radius:9px!important;font-size:10px!important;box-shadow:none!important}
    .aiscanmeta{font-size:10px!important;padding:5px 8px!important}
    .reviewgrid{gap:9px!important}
    .reviewitem{padding:12px!important;border-radius:13px!important;box-shadow:none!important}
    .reviewmerchant strong{font-size:13px!important}
    .reviewamount{font-size:11px!important}
    .confidence{font-size:9px!important;padding:4px 6px!important}
    .reviewmeta{padding:8px 0 10px 17px!important;font-size:10px!important}
    .reviewactions{gap:6px!important;padding-left:17px!important}
    .approvebill,.rejectbill{min-height:30px!important;padding:6px 9px!important;font-size:10px!important;border-radius:8px!important}
    .reviewactions .rejectbill{width:auto!important;height:auto!important;min-width:96px!important;white-space:nowrap!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;line-height:1.2!important;padding:6px 10px!important;border-radius:8px!important}

    /* Responsive */
    @media(max-width:900px){
      .wrap{padding:24px 18px 44px!important}
      .head{align-items:flex-start!important}
      .grid4{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .two{grid-template-columns:1fr!important}
      .progresswrap{min-width:0!important;width:100%}
      .pielegend{grid-template-columns:1fr 1fr!important}
      .reminderlist{max-height:460px!important}
    }
    @media(max-width:650px){
      .wrap{padding:18px 12px 34px!important}
      .head{display:grid!important;grid-template-columns:1fr!important;gap:12px!important}
      .controls{width:100%;display:flex!important;flex-wrap:wrap!important}
      .controls>label{width:100%}
      .controls select{flex:1 1 150px;min-width:0}
      .themebtn{margin-left:auto}
      .tabs{margin:17px -12px 15px!important;padding:0 12px 5px!important;overflow-x:auto!important;flex-wrap:nowrap!important;scrollbar-width:none}
      .tabs::-webkit-scrollbar{display:none}
      .tab{flex:0 0 auto;padding:7px 12px!important;font-size:12px!important}
      .grid4{grid-template-columns:1fr!important;gap:10px!important}
      .card{padding:14px!important;border-radius:15px!important}
      .value{font-size:23px!important}
      .reviewbar{align-items:flex-start!important;flex-direction:column!important;gap:9px!important}
      .txhead{align-items:stretch!important}
      .txfilters{display:grid!important;grid-template-columns:1fr!important;width:100%}
      .txfilters input,.txfilters select,.check{width:100%!important;min-width:0!important}
      .tablewrap{margin-left:-4px;margin-right:-4px;max-width:calc(100% + 8px)}
      table{min-width:650px}
      .modal{width:calc(100% - 14px)!important;border-radius:15px!important}
      .modalhead{padding:15px!important}.modalbody{padding:0 15px 15px!important}
      .upcominghead{gap:9px!important}
      .upnav{width:100%;display:grid!important;grid-template-columns:auto 1fr auto!important}
      .upnav .scanbtn{grid-column:1/-1}
      .calendarweek,.calendargrid{gap:3px!important}
      .calday{min-height:54px!important;padding:4px!important;border-radius:8px!important}
      .calevent small{display:none!important}
      .calevent{display:inline-flex!important;margin-right:2px!important}
      .billrow{grid-template-columns:1fr!important;gap:8px!important}
      .billactions{width:100%;display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important}
      .dueinput{width:100%!important;min-width:0!important}
      .reminderlist{max-height:400px!important}
      .aireview{padding:13px!important;border-radius:15px!important}
      .aihead{flex-direction:column!important;gap:8px!important}
      .reviewgrid{grid-template-columns:1fr!important}
      .reviewactions{padding-left:0!important}
      .reviewmeta{padding-left:0!important}
      .reviewactions button{flex:1 1 auto}
      .reviewactions .rejectbill{min-width:0!important}
      .pielegend{grid-template-columns:1fr!important}
    }
    @media(max-width:380px){
      .wrap{padding-left:10px!important;padding-right:10px!important}
      h1{font-size:25px!important}
      .tabs{margin-left:-10px!important;margin-right:-10px!important;padding-left:10px!important;padding-right:10px!important}
      #undoBtn,#redoBtn{width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;font-size:15px!important}
      .themebtn{padding:7px 9px!important}
      .calday{min-height:48px!important}
      .paidbtn,.removebill{width:27px!important;height:27px!important}
    }
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  function polish(){
    const undo=document.getElementById('undoBtn');
    const redo=document.getElementById('redoBtn');
    if(undo){
      if(undo.textContent!=='↶')undo.textContent='↶';
      if(undo.getAttribute('aria-label')!=='Undo last change')undo.setAttribute('aria-label','Undo last change');
      if(undo.hasAttribute('title'))undo.removeAttribute('title');
    }
    if(redo){
      if(redo.textContent!=='↷')redo.textContent='↷';
      if(redo.getAttribute('aria-label')!=='Redo last change')redo.setAttribute('aria-label','Redo last change');
      if(redo.hasAttribute('title'))redo.removeAttribute('title');
    }
  }
  polish();
  new MutationObserver(()=>polish()).observe(document.body,{childList:true,subtree:true});
})();
