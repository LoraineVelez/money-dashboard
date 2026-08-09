const fs=require('fs');
let s=fs.readFileSync('index.html','utf8');

// The checked-in index is already the styled production shell. Keep this build
// step intentionally small and idempotent so UI refinements are preserved.
if(!/name="robots"/.test(s)){
  s=s.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow">');
}
if(!/aria-live="polite"/.test(s)){
  s=s.replace('<div id="app">','<div id="app" aria-live="polite">');
}

const prod='<script src="data-static.js?v=20260809d"></script><script src="app.js?v=20260809d"></script><script src="upcoming.js?v=20260809d"></script><script src="ui-polish.js?v=20260809d"></script>';
let start=s.indexOf('<script src="data-static.js');
if(start<0)start=s.indexOf('<script src="data-v4-0.js');
const end=s.indexOf('</body>');
if(start<0||end<0||start>end)throw new Error('Production script replacement failed');
s=s.slice(0,start)+prod+'\n'+s.slice(end);

if(!s.includes('data-static.js')||!s.includes('upcoming.js')||!s.includes('ui-polish.js')||s.includes('data-v4-0.js')){
  throw new Error('Production script replacement failed');
}
fs.writeFileSync('candidate.html',s);
console.log('Wrote candidate.html');
