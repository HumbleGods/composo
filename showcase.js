(function(){
  const grid=document.getElementById('portfolio-grid');
  if(!grid) return;
  const cards=[...grid.querySelectorAll('.pcard')];
  if(cards.length<3) return;
  const COLORS={graphic:'#14b8a6',system:'#0ea5e9',marketing:'#f59e0b',it:'#f43f5e'};
  const LABEL={graphic:'Graphic Design',system:'System Development',marketing:'Digital Marketing',it:'Computer Technician'};
  const data=cards.map(c=>({cat:c.dataset.category,title:c.dataset.title,src:c.querySelector('img').getAttribute('src')}));

  // Build DOM
  const sc=document.createElement('div');sc.className='showcase';
  sc.innerHTML='<div class="sc-stage"></div><div class="sc-base"></div>'+
    '<div class="sc-nav"><button aria-label="Previous">&larr;</button><button aria-label="Next">&rarr;</button></div>'+
    '<div class="sc-info"><p class="sc-cat"></p><h3 class="sc-title"></h3></div>';
  grid.parentNode.insertBefore(sc,grid);
  const stage=sc.querySelector('.sc-stage');
  const items=data.map((d,i)=>{const el=document.createElement('div');el.className='sc-item';
    el.innerHTML='<img alt="'+d.title+'" src="'+d.src+'" draggable="false">';
    el.onclick=()=>go(i);stage.appendChild(el);return el;});
  const catEl=sc.querySelector('.sc-cat'),titleEl=sc.querySelector('.sc-title');
  const n=items.length,step=360/n,radius=Math.max(300,n*60);
  let idx=0,angle=0,target=0;

  function setScene(color){document.documentElement.style.setProperty('--scene',color);}
  function go(i){
    // shortest path
    let diff=((i-idx)%n+n)%n; if(diff>n/2) diff-=n;
    target-=diff*step; idx=((i%n)+n)%n; render();
  }
  function render(){
    const d=data[idx];
    catEl.textContent=LABEL[d.cat]||d.cat; titleEl.textContent=d.title;
    titleEl.classList.remove('glitch'); void titleEl.offsetWidth; titleEl.classList.add('glitch');
    setScene(COLORS[d.cat]||'#10b981');
    items.forEach((el,k)=>el.classList.toggle('active',k===idx));
  }
  // smooth rotation loop
  (function tick(){
    angle+=(target-angle)*0.08;
    items.forEach((el,k)=>{
      el.style.transform='rotateY('+(k*step+angle)+'deg) translateZ('+radius+'px)';
    });
    stage.style.transform='translateZ(-'+radius+'px)';
    requestAnimationFrame(tick);
  })();

  const [prev,next]=sc.querySelectorAll('.sc-nav button');
  prev.onclick=()=>go(idx-1); next.onclick=()=>go(idx+1);

  // drag / swipe
  let sx=null;
  sc.addEventListener('pointerdown',e=>{sx=e.clientX});
  window.addEventListener('pointerup',e=>{
    if(sx===null) return; const dx=e.clientX-sx; sx=null;
    if(Math.abs(dx)>40) go(idx+(dx<0?1:-1));
  });
  sc.setAttribute('tabindex','0');
  sc.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(idx+1);if(e.key==='ArrowLeft')go(idx-1);});

  // auto-advance only while visible and not reduced-motion
  let visible=false,timer;
  new IntersectionObserver(es=>{visible=es[0].isIntersecting},{threshold:.4}).observe(sc);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)
    timer=setInterval(()=>{if(visible&&!sc.matches(':hover'))go(idx+1)},4000);

  // Scroll-driven scene color for other sections
  const glow=document.createElement('div');glow.className='scene-glow';document.body.prepend(glow);
  const sceneBy={home:'#10b981',about:'#0ea5e9',services:'#f59e0b',skills:'#14b8a6',pricing:'#f43f5e',blog:'#0ea5e9',contact:'#10b981'};
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting&&e.target.id!=='portfolio'&&sceneBy[e.target.id]) setScene(sceneBy[e.target.id]);
    if(e.isIntersecting&&e.target.id==='portfolio') setScene(COLORS[data[idx].cat]);
  }),{rootMargin:'-45% 0px -45% 0px'});
  document.querySelectorAll('main section[id]').forEach(s=>io.observe(s));
  render();
})();
