(function () {
  'use strict';
  const api=window.SolarSquare;
  const {EXHIBITS,getExhibit,findNumber,verify,sum}=api;
  const square=document.getElementById('square'),frame=document.querySelector('.square-frame');
  const title=document.getElementById('inspector-headline'),body=document.getElementById('inspector-body');
  const kicker=document.getElementById('inspector-kicker'),result=document.getElementById('inspector-sum');
  const modeButtons=Array.from(document.querySelectorAll('[data-mode]'));
  const state={exhibit:getExhibit(new URLSearchParams(window.location.search).get('square'))||getExhibit('sun'),mode:'focus',number:null,traceCount:1};
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.classList.add('trace-svg');svg.setAttribute('aria-hidden','true');
  let cells=[],ordered=[];
  const put=(id,value)=>{document.getElementById(id).textContent=String(value);};
  const inspect=(a,b,c,d)=>{kicker.textContent=a;title.textContent=b;body.textContent=c;result.textContent=d;};
  const groups={planetary:document.getElementById('planetary-switcher'),masterpiece:document.getElementById('historic-switcher')};
  for(const e of EXHIBITS) {
    const button=document.createElement('button');button.type='button';button.className='collection-option';
    button.dataset.exhibit=e.id;button.setAttribute('aria-pressed','false');
    const proof=verify(e.grid,e);
    button.setAttribute('aria-label',e.name+'. '+e.grid.length+' by '+e.grid.length+'. '+(e.semimagic?'Row and column sum ':'Magic sum ')+proof.magicConstant);
    const symbol=document.createElement('span');symbol.className='option-symbol';symbol.textContent=e.symbol;symbol.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.textContent=e.name;
    button.append(symbol,label);button.addEventListener('click',()=>choose(e.id));groups[e.group].appendChild(button);
  }
  document.getElementById('generate-button').addEventListener('click',()=>choose('generated-'+document.getElementById('generator-order').value));
  function choose(id){
    const next=getExhibit(id);if(!next)return;
    if(state.exhibit.id===id){state.mode='focus';state.number=null;state.traceCount=1;build();return;}
    state.exhibit=next;state.mode='focus';state.number=null;state.traceCount=1;
    const url=new URL(window.location.href);
    if(id==='sun')url.searchParams.delete('square');else url.searchParams.set('square',id);
    window.history.pushState({ square: id },'',url.pathname+url.search+url.hash);
    build();
  }
  function build(){
    const e=state.exhibit,g=e.grid,n=g.length,proof=verify(g,e);
    if(!proof.valid){put('verification-status','CHECK FAILED');put('check-status','Dataset verification failed');return;}
    ordered=g.flat().slice().sort((a,b)=>a-b);
    const fragment=document.createDocumentFragment();cells=[];
    g.forEach((row,r)=>row.forEach((value,c)=>{
      const cell=document.createElement('button');cell.type='button';cell.className='cell';
      cell.textContent=value;cell.dataset.row=r;cell.dataset.col=c;cell.dataset.number=value;
      cell.tabIndex=c===0&&r===0?0:-1;
      cell.setAttribute('aria-label','Number '+value+', row '+(r+1)+', column '+(c+1));
      cell.addEventListener('click',()=>{
        if(state.mode==='trace')state.traceCount=ordered.indexOf(value)+1;
        else state.number=value;
        cells.forEach(item=>{item.tabIndex=item===cell?0:-1;});render();
      });
      cell.addEventListener('keydown',ev=>{
        const moves={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};
        if(!moves[ev.key])return;ev.preventDefault();
        const [dr,dc]=moves[ev.key],rr=Math.max(0,Math.min(n-1,r+dr)),cc=Math.max(0,Math.min(n-1,c+dc));
        const index=rr*n+cc;cells.forEach((item,i)=>{item.tabIndex=i===index?0:-1;});cells[index].focus();
      });
      fragment.appendChild(cell);cells.push(cell);
    }));
    square.replaceChildren(fragment,svg);
    square.style.setProperty('--order',n);square.dataset.order=n;
    square.setAttribute('aria-label','Interactive '+n+' by '+n+' '+e.name+(e.semimagic?' semimagic-square study':' magic-square study'));
    frame.classList.toggle('large-order',n>=7);
    document.getElementById('scroll-hint').hidden=n<7;
    document.title='Magic Square · '+e.name;
    put('square-label','02 / '+e.name.toUpperCase());put('panel-symbol',e.symbol);
    put('square-range',n*n+' ENTRIES · '+(e.normal?'1–'+n*n:'CUSTOM INTEGERS'));
    put('metric-order',n+' × '+n);put('metric-constant',proof.magicConstant);
    put('metric-total',proof.total.toLocaleString('en-US'));
    put('check-status',e.semimagic?(2*n)+' verified rows/columns · straight diagonals differ':(2*n+2)+' equal-sum lines independently checked');
    put('verification-status','VERIFIED');
    const collectionType=e.group==='planetary'?'Planetary':e.group==='masterpiece'?'Masterpiece':'Laboratory';
    put('collection-description',collectionType+' · '+e.name+' · '+n+'×'+n+' · Σ '+proof.magicConstant);
    put('constant-equation',proof.total.toLocaleString('en-US')+' ÷ '+n+' = '+proof.magicConstant);
    put('constant-copy','The '+n*n+' entries total '+proof.total.toLocaleString('en-US')+'. Each balanced row and column returns '+proof.magicConstant+'.');
    put('complement-equation',e.normal?'a + ('+(n*n+1)+' − a) = '+(n*n+1):'Custom-number design');
    put('complement-copy',e.normal?'The numbers 1 through '+(n*n)+' pair arithmetically to '+(n*n+1)+'. These partners need not be opposite cells.':'This design uses nonconsecutive values; the normal complement formula does not apply.');
    put('context-title',e.group==='planetary'?'The square and its story.':'The design and its story.');
    put('context-era',e.tagline);put('context-description',e.description);
    const sourceNames={
      'lo-shu':'SAGE Open · research article',
      durer:'National Gallery of Art · artwork',
      franklin:'MacTutor · historical record',
      ramanujan:'Azim Premji University · research article'
    };
    const sourceName=e.group==='planetary'?'Agrippa · planetary tables':
      e.group==='laboratory'?'Wolfram MathWorld · mathematical reference':sourceNames[e.id];
    const link=document.getElementById('source-link');link.href=e.sourceUrl;
    link.textContent=e.name+' · '+sourceName+' ↗';
    document.getElementById('solar-art').hidden=e.id!=='sun';
    document.getElementById('context').classList.toggle('context-solo',e.id!=='sun');
    document.getElementById('mode-pairs').disabled=!e.normal;
    document.getElementById('mode-pairs').title=e.normal?'':'Only applicable to normal 1–n² squares';
    put('mode-trace',e.normal?'Trace 1 → '+(n*n):'Trace values');
    document.querySelectorAll('[data-exhibit]').forEach(button=>{
      const active=button.dataset.exhibit===e.id;button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    const drawer=document.getElementById('additional-collection');
    drawer.open=e.group!=='planetary';
    const laboratoryState=document.getElementById('laboratory-state');
    laboratoryState.hidden=e.group!=='laboratory';
    if(e.group==='laboratory')laboratoryState.textContent='VIEWING '+n+' × '+n+' · Σ '+proof.magicConstant;
    render();
  }
  function trace(){
    svg.replaceChildren();if(state.mode!=='trace')return;
    svg.setAttribute('viewBox','0 0 '+square.clientWidth+' '+square.clientHeight);
    const grid=state.exhibit.grid,n=grid.length;
    const points=ordered.slice(0,state.traceCount).map(value=>{
      const {row,col}=findNumber(value,grid),cell=cells[row*n+col];
      return [cell.offsetLeft+cell.offsetWidth/2,cell.offsetTop+cell.offsetHeight/2];
    });
    const poly=document.createElementNS(ns,'polyline');
    poly.setAttribute('points',points.map(p=>p.join(',')).join(' '));poly.setAttribute('fill','none');
    poly.setAttribute('stroke','#f3cd7f');poly.setAttribute('stroke-width','2');
    poly.setAttribute('stroke-linecap','round');poly.setAttribute('stroke-linejoin','round');
    svg.appendChild(poly);
    const last=points.at(-1);if(!last)return;
    const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',last[0]);dot.setAttribute('cy',last[1]);
    dot.setAttribute('r','5');dot.setAttribute('fill','#ffe1a1');svg.appendChild(dot);
  }
  function render(){
    const e=state.exhibit,g=e.grid,n=g.length,{mode,number}=state;
    const constant=verify(g,e).magicConstant,selected=number===null?null:findNumber(number,g);
    const paired=number===null?null:n*n+1-number;
    const seen=new Set(ordered.slice(0,state.traceCount));
    modeButtons.forEach(button=>{const on=button.dataset.mode===mode;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));});
    cells.forEach(cell=>{
      const r=+cell.dataset.row,c=+cell.dataset.col,v=+cell.dataset.number;
      let active=false;
      if(mode==='focus'&&selected)active=r===selected.row||c===selected.col;
      else if(mode==='rows')active=r===(selected?.row??0);
      else if(mode==='columns')active=c===(selected?.col??0);
      else if(mode==='diagonals')active=r===c||r+c===n-1;
      else if(mode==='pairs'&&number!==null)active=v===number||v===paired;
      cell.classList.toggle('active',active);
      cell.classList.toggle('secondary',mode==='trace'&&seen.has(v));
      cell.classList.toggle('selected',number===v&&mode!=='trace');
      cell.setAttribute('aria-pressed',String(number===v&&mode!=='trace'));
    });
    document.getElementById('trace-actions').hidden=mode!=='trace';
    if(mode==='trace'){
      document.getElementById('trace-prev').disabled=state.traceCount<=1;
      document.getElementById('trace-next').disabled=state.traceCount>=n*n;
      inspect('PATH THROUGH THE GRID','Through '+ordered[state.traceCount-1],
        'Follow the sorted numerical path by selecting any number or using Previous and Next. The path is a visualization, not a supernatural effect.',
        state.traceCount+' of '+n*n+' positions traced');
    }else if(mode==='rows'){
      const r=selected?.row??0;inspect('ROW STRUCTURE','Row '+(r+1)+' = '+constant,'Select a different row to compare.',g[r].join(' + ')+' = '+sum(g[r]));
    }else if(mode==='columns'){
      const c=selected?.col??0,a=g.map(row=>row[c]);inspect('COLUMN STRUCTURE','Column '+(c+1)+' = '+constant,'Select a different column to compare.',a.join(' + ')+' = '+sum(a));
    }else if(mode==='diagonals'){
      const a=sum(g.map((r,i)=>r[i])),b=sum(g.map((r,i)=>r[n-1-i]));
      inspect(e.semimagic?'THE EXCEPTION':'TWO DIAGONALS',
        e.semimagic?'Franklin is semimagic.':'Two directions. One sum.',
        e.semimagic?'The straight diagonals differ from the row-and-column invariant. Franklin studied special bent diagonals.':'Both main diagonals equal the ordinary magic constant.',
        a+' and '+b+(e.semimagic?' · rows = '+constant:''));
    }else if(mode==='pairs'){
      inspect('COMPLEMENTARY PAIRS',number===null?'Every number has a partner.':number+' + '+paired+' = '+(n*n+1),
        'The arithmetic complement is '+(n*n+1)+' minus the selected value; partners need not occupy opposite cells.',
        number===null?'Select any cell.':(n*n+1)+' − '+number+' = '+paired);
    }else if(number!==null){
      const {row,col}=selected;
      inspect('SELECTED NUMBER',number+' · Row '+(row+1)+', Column '+(col+1),
        'Its row and column share the same invariant.','Row = '+sum(g[row])+' · Column = '+sum(g.map(r=>r[col])));
    }else{
      inspect('THE INVARIANT',e.semimagic?'Every row and column = '+constant+'.':'Every line returns to '+constant+'.',
        'Select a number to illuminate its row and column, or choose a structural exploration mode.',
        e.semimagic?n+' rows + '+n+' columns; straight diagonals are exceptional.':n+' rows + '+n+' columns + 2 diagonals = '+(2*n+2)+' equal lines.');
    }
    trace();
  }
  modeButtons.forEach(button=>button.addEventListener('click',()=>{
    if(button.disabled)return;state.mode=button.dataset.mode;
    if(state.mode==='trace'){state.traceCount=1;state.number=null;}
    render();
  }));
  document.getElementById('trace-prev').addEventListener('click',()=>{state.traceCount=Math.max(1,state.traceCount-1);render();});
  document.getElementById('trace-next').addEventListener('click',()=>{state.traceCount=Math.min(ordered.length,state.traceCount+1);render();});
  window.addEventListener('resize',trace);
  window.addEventListener('popstate',()=>{
    const id=new URLSearchParams(window.location.search).get('square');
    const exhibit=getExhibit(id)||getExhibit('sun');
    state.exhibit=exhibit;state.mode='focus';state.number=null;state.traceCount=1;
    build();
  });
  build();
})();
