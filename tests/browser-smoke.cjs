'use strict';
// Browser V&V is intentionally dependency-free: it uses the Chrome already on the CI runner.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFile,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const probe=String.raw\`
(async()=>{
 const q=s=>document.querySelector(s),by=id=>document.getElementById(id);
 const check=(value,message)=>{if(!value)throw Error(message)};
 const choose=id=>{const b=q('[data-exhibit="'+id+'"]');check(b,'Missing '+id);b.click()};
 const inspect=id=>{
   const item=window.SolarSquare.getExhibit(id),n=item.grid.length;
   const cells=[...document.querySelectorAll('#square > .cell')];
   check(cells.length===n*n,'Cell count '+id);
   check(cells.map(c=>Number(c.textContent)).join()===item.grid.flat().join(),'Grid mismatch '+id);
   check(by('metric-constant').textContent==String(window.SolarSquare.verify(item.grid,item).magicConstant),'Sum '+id);
   check(by('verification-status').textContent==='VERIFIED','Status '+id);
   check(q('.status-dot'),'Lost status ornament '+id);
   check(by('panel-symbol').textContent===item.symbol,'Symbol '+id);
   check(cells.filter(c=>c.tabIndex===0).length===1,'Roving focus '+id);
   check(by('mode-pairs').disabled===!item.normal,'Complements '+id);
   check(by('source-link').textContent.includes(item.name),'Source name '+id);
   check(document.title.includes(item.name),'Document title '+id);
   return cells;
 };
 try{
   inspect(new URLSearchParams(location.search).get('square')||'sun');
   by('additional-collection').open=true;
   for(const id of ['saturn','jupiter','mars','sun','venus','mercury','moon','lo-shu','durer','franklin','ramanujan']){choose(id);inspect(id)}
   choose('franklin');q('[data-mode="diagonals"]').click();
   check(by('inspector-headline').textContent.includes('semimagic'),'Franklin diagonal honesty');
   choose('sun');let cells=inspect('sun');cells[0].click();
   check(cells[0].classList.contains('selected'),'Inspect click');
   cells[0].focus();cells[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
   check(document.activeElement===cells[1],'Keyboard arrow');
   for(const mode of ['rows','columns','diagonals','pairs','trace']){
     q('[data-mode="'+mode+'"]').click();
     check(q('[data-mode="'+mode+'"]').getAttribute('aria-pressed')==='true','Mode '+mode);
   }
   check(!by('trace-actions').hidden,'Trace controls');
   by('trace-next').click();check(by('inspector-sum').textContent.includes('2 of 36'),'Trace advance');
   by('trace-prev').click();check(by('inspector-sum').textContent.includes('1 of 36'),'Trace reverse');
   for(let n=3;n<=12;n++){by('generator-order').value=n;by('generate-button').click();inspect('generated-'+n)}
   choose('durer');const previous=history.length;choose('durer');check(history.length===previous,'Duplicate history');
   choose('ramanujan');history.back();await new Promise(r=>setTimeout(r,180));inspect('durer');
   choose('moon');cells=inspect('moon');
   if(innerWidth<=600){
     check(!by('scroll-hint').hidden,'Mobile swipe cue');
     check(cells[0].getBoundingClientRect().width>=44,'Touch target below 44px');
   }
   check(document.documentElement.scrollWidth<=innerWidth+3,'Page-level horizontal overflow');
   document.body.dataset.audit='pass';
 }catch(e){document.body.dataset.audit='fail';document.body.dataset.auditError=encodeURIComponent(e.message||String(e))}
})();\`;
function chrome(){
 for(const name of ['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'])
  if(fs.existsSync(name))return name;
 for(const name of ['google-chrome','chromium','chromium-browser']){
  const x=spawnSync('which',[name],{encoding:'utf8'});if(x.status===0)return x.stdout.trim();
 }
 throw Error('Chrome/Chromium unavailable; cannot certify UX');
}
const allow=new Set(['/styles.css','/square.js','/app.js','/assets/solar-square-art.webp']);
function run(executable,url,w,h){return new Promise((resolve,reject)=>{
 execFile(executable,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',
 '--no-first-run','--disable-background-networking','--force-device-scale-factor=1',
 '--window-size='+w+','+h,'--virtual-time-budget=5000','--dump-dom',url],
 {encoding:'utf8',timeout:60000,maxBuffer:8e6},(error,stdout,stderr)=>{
 if(error)return reject(Error(error.message+' '+stderr.slice(-500)));
 if(!/data-audit="pass"/.test(stdout)){
  const msg=stdout.match(/data-audit-error="([^"]*)"/)?.[1];
  return reject(Error('Viewport '+w+'x'+h+': '+(msg?decodeURIComponent(msg):'no browser result')));
 }
 resolve('Chromium UX PASS '+w+'×'+h);
 });
});}
(async()=>{
 const html=source.replace('</body>','<script>'+probe+'</script></body>');
 const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://127.0.0.1').pathname;
  if(pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html)}
  if(!allow.has(pathname)){res.writeHead(404);return res.end('Not found')}
  const file=path.join(root,pathname.slice(1)),type=pathname.endsWith('.js')?'text/javascript':pathname.endsWith('.css')?'text/css':'image/webp';
  res.writeHead(200,{'Content-Type':type});fs.createReadStream(file).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 try{
  for(const [w,h,search] of [[1280,900,''],[768,900,'?square=durer'],[390,844,'?square=moon'],[320,740,'?square=sun']]){
   console.log(await run(chrome(),'http://127.0.0.1:'+port+'/'+search,w,h));
  }
 }finally{await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
