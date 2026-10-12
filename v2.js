(function(){
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
window.__ambient = true;
const fmt = (v, dec) => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');

function countUp(root){
  root.querySelectorAll('[data-count]').forEach(el=>{
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec||0);
    const pre = el.dataset.pre||'', suf = el.dataset.suf||'';
    const done = () => el.textContent = pre + fmt(to,dec) + suf;
    if (RM || to === 0) return done();
    done(); el.style.minWidth = el.offsetWidth + 'px';
    const t0 = performance.now(), dur = 1600;
    const step = t => { const p = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-p,3);
      el.textContent = pre + fmt(to*e,dec) + suf; if (p<1) requestAnimationFrame(step); };
    el.textContent = pre + fmt(0,dec) + suf; requestAnimationFrame(step);
  });
}

/* Vision radial diagram */
function buildVision(){
  const host = document.getElementById('vis'); if(!host) return;
  const cx=700, cy=650, R=225, CR=106, spine=1190;
  const src=['Name & contact','Address & property','Email threads','Texts & calls','Notes & tasks','Jobsite photos','Contracts & documents','Proposals & costs','Aerial measurements','Enrichment & public data','Hail & weather history','QuickBooks & supplier pricing'];
  const out=['Replies in 60 seconds','Ranks the day’s moves','Follows up every bid','Builds the quote','Preps the adjuster','Orders the materials'];
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','0 0 1920 1080');
  const orb=document.createElementNS(NS,'circle'); Object.entries({cx,cy,r:R,fill:'none',stroke:'rgba(128,188,214,.14)','stroke-dasharray':'2 8'}).forEach(([k,v])=>orb.setAttribute(k,v)); svg.appendChild(orb);
  const lines=[], dots=[], labs=[];
  src.forEach((s,i)=>{
    const a=(-75+30*i)*Math.PI/180, c=Math.cos(a), sn=Math.sin(a);
    const x=cx+R*c, y=cy+R*sn, d=(0.25+i*0.12)+'s';
    const ln=document.createElementNS(NS,'line');
    Object.entries({x1:x,y1:y,x2:cx+CR*c,y2:cy+CR*sn,class:'vl',pathLength:1}).forEach(([k,v])=>ln.setAttribute(k,v));
    ln.style.setProperty('--d',d); svg.appendChild(ln); lines.push(ln);
    const dt=document.createElementNS(NS,'circle'); Object.entries({cx:x,cy:y,r:6,class:'vdot'}).forEach(([k,v])=>dt.setAttribute(k,v)); svg.appendChild(dt); dots.push(dt);
    const lb=document.createElement('div'); lb.className='vlab'; lb.textContent=s; lb.style.setProperty('--d',d);
    lb.style.left=x+'px'; lb.style.top=y+'px';
    const vy = Math.abs(c)<=0.3 ? (sn>0?'8px':'calc(-100% - 8px)') : '-50%';
    if(c>0){lb.style.transform=`translate(16px,${vy})`;}
    else{lb.style.transform=`translate(calc(-100% - 16px),${vy})`;lb.style.textAlign='right';}
    if(Math.abs(c)<=0.3) lb.style.maxWidth='180px';
    labs.push(lb);
  });
  const mk=(dpath,d)=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',dpath);p.setAttribute('class','dl');p.setAttribute('pathLength',1);p.style.setProperty('--d',d);svg.appendChild(p);};
  mk(`M${cx+CR} ${cy} H${spine}`,'1.75s');
  host.appendChild(svg);
  labs.forEach((lb,i)=>{host.appendChild(lb);
    lb.addEventListener('mouseenter',()=>{lb.classList.add('hot');lines[i].classList.add('hot');dots[i].classList.add('hot');});
    lb.addEventListener('mouseleave',()=>{lb.classList.remove('hot');lines[i].classList.remove('hot');dots[i].classList.remove('hot');});
  });
  const core=document.createElement('div'); core.className='vcore'; core.innerHTML='Toolsey<br>core<br>repository';
  core.style.left=(cx-106)+'px'; core.style.top=(cy-106)+'px'; host.appendChild(core);
}

/* Cover network */
function coverNet(){
  const cv=document.getElementById('net'); if(!cv) return;
  const W=cv.width=1920, H=cv.height=1080, ctx=cv.getContext('2d');
  const F={x:1480,y:470};
  const spawn=(edge)=>{const s=Math.random();let x,y;
    if(edge){const k=Math.floor(Math.random()*4);x=k===0?-20:k===1?W+20:Math.random()*W;y=k===2?-20:k===3?H+20:Math.random()*H;}
    else{x=Math.random()*W;y=Math.random()*H;}
    return {x,y,v:0.15+s*0.35};};
  const N=[...Array(80)].map(()=>spawn(false));
  let run=false;
  function frame(move){
    ctx.clearRect(0,0,W,H);
    const g=ctx.createRadialGradient(F.x,F.y,0,F.x,F.y,380);
    g.addColorStop(0,'rgba(128,188,214,.55)');g.addColorStop(.12,'rgba(0,120,173,.28)');g.addColorStop(1,'rgba(0,120,173,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(const n of N){
      if(move){const dx=F.x-n.x,dy=F.y-n.y,dd=Math.hypot(dx,dy)||1;n.x+=dx/dd*n.v;n.y+=dy/dd*n.v;if(dd<40)Object.assign(n,spawn(true));}
    }
    ctx.lineWidth=1;
    for(let i=0;i<N.length;i++){for(let j=i+1;j<N.length;j++){
      const a=N[i],b=N[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<170){ctx.strokeStyle=`rgba(128,188,214,${(1-d/170)*0.22})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    }}
    for(const n of N){const d=Math.hypot(F.x-n.x,F.y-n.y);ctx.fillStyle=`rgba(203,227,238,${0.25+Math.max(0,1-d/900)*0.6})`;ctx.beginPath();ctx.arc(n.x,n.y,1.8,0,7);ctx.fill();}
    ctx.fillStyle='#E6F2F7';ctx.beginPath();ctx.arc(F.x,F.y,4,0,7);ctx.fill();
  }
  function loop(){ if(!run) return; frame(true); requestAnimationFrame(loop); }
  window.__coverNet = (on)=>{ const want = on && window.__ambient && !RM; if(want && !run){run=true;loop();} else if(!want){run=false;frame(false);} };
  frame(false);
}

function toggle(){
  document.querySelectorAll('.seg').forEach(seg=>{
    const sec=seg.closest('section');
    seg.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      seg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
      sec.dataset.mode=b.dataset.m;
    }));
  });
}

function rotator(){
  document.querySelectorAll('.rot').forEach(r=>{
    const words=r.dataset.words.split('|'), sp=r.firstElementChild; let i=0;
    if(RM) return;
    setInterval(()=>{
      if(!r.closest('[data-deck-active]') || document.body.classList.contains('still')) return;
      sp.classList.add('out');
      setTimeout(()=>{ i=(i+1)%words.length; sp.textContent=words[i]; sp.classList.remove('out'); sp.classList.add('in');
        requestAnimationFrame(()=>requestAnimationFrame(()=>sp.classList.remove('in'))); },450);
    },1800);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  buildVision(); coverNet(); toggle(); rotator();
  const stage=document.querySelector('deck-stage');
  const onChange=e=>{ const s=e.detail.slide; if(s) countUp(s); window.__coverNet && window.__coverNet(s && s.classList.contains('cover')); };
  stage.addEventListener('slidechange',onChange);
  const act=stage.querySelector('[data-deck-active]'); if(act) onChange({detail:{slide:act}});
});
})();
