
const paths=[...document.querySelectorAll(".trace-line")];
const callouts=[...document.querySelectorAll(".callout")];
const point=document.querySelector(".white-plot-point");
const title=document.querySelector(".drawing-title");
const svg=document.querySelector(".engine-svg");

const DRAW_MS=5000;
let pathInfo=[], totalWeight=0, startTime=null, completed=false;

function prepare(){
  paths.forEach(p=>{
    const len=p.getTotalLength();
    // Use actual geometry length for time allocation.
    const weight=Math.max(18,len);
    pathInfo.push({len,weight});
    totalWeight+=weight;
    p.style.strokeDasharray=len;
    p.style.strokeDashoffset=len;
  });

  callouts.forEach(g=>{
    const line=g.querySelector(".callout-line");
    const len=line.getTotalLength();
    line.dataset.len=len;
    line.style.strokeDasharray=len;
    line.style.strokeDashoffset=len;
    g.querySelector(".callout-node").style.opacity="0";
  });
}

function ease(t){
  return t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
}

function typeText(el,text,ms){
  el.textContent="";
  let i=0;
  const chars=[...text];
  const dt=Math.max(16,ms/Math.max(1,chars.length));
  const timer=setInterval(()=>{
    el.textContent+=chars[i++]||"";
    if(i>=chars.length) clearInterval(timer);
  },dt);
}

function draw(ts){
  if(!startTime) startTime=ts;
  const p=Math.min(1,(ts-startTime)/DRAW_MS);
  const target=ease(p)*totalWeight;

  let acc=0, active=-1, local=0;

  for(let i=0;i<paths.length;i++){
    const w=pathInfo[i].weight;
    const next=acc+w;

    if(target>=next){
      paths[i].style.strokeDashoffset=0;
    }else if(target>acc && active<0){
      active=i;
      local=(target-acc)/w;
      paths[i].style.strokeDashoffset=pathInfo[i].len*(1-local);
    }else if(active<0){
      paths[i].style.strokeDashoffset=pathInfo[i].len;
    }
    acc=next;
  }

  if(active>=0){
    const path=paths[active];
    const pt=path.getPointAtLength(pathInfo[active].len*local);
    point.setAttribute("transform",`translate(${pt.x} ${pt.y})`);
    point.style.opacity=".82";
  }

  if(p<1){
    requestAnimationFrame(draw);
  }else{
    point.style.opacity="0";
    startAnnotations();
  }
}

function drawCallout(group,duration=650){
  return new Promise(resolve=>{
    const line=group.querySelector(".callout-line");
    const node=group.querySelector(".callout-node");
    const titleEl=group.querySelector(".callout-title");
    const bodyEl=group.querySelector(".callout-body");
    const len=Number(line.dataset.len);
    const t0=performance.now();

    function frame(t){
      const p=Math.min(1,(t-t0)/duration);
      line.style.strokeDashoffset=len*(1-p);
      if(p<1){
        requestAnimationFrame(frame);
      }else{
        node.style.opacity="1";
        typeText(titleEl,titleEl.dataset.text,520);
        setTimeout(()=>typeText(bodyEl,bodyEl.dataset.text,440),300);
        setTimeout(resolve,900);
      }
    }
    requestAnimationFrame(frame);
  });
}

async function startAnnotations(){
  // Nothing from the source blueprint appears before this phase.
  for(const g of callouts){
    await drawCallout(g,620);
  }
  title.style.transition="opacity 1.1s ease";
  title.style.opacity="1";
  completed=true;
}

function nearestPath(clientX,clientY){
  const ctm=svg.getScreenCTM();
  if(!ctm) return null;
  const pt=svg.createSVGPoint();
  pt.x=clientX; pt.y=clientY;
  const local=pt.matrixTransform(ctm.inverse());

  let best=null, bestD=Infinity;
  for(const p of paths){
    const len=p.getTotalLength();
    const samples=Math.max(10,Math.min(40,Math.ceil(len/38)));
    for(let i=0;i<=samples;i++){
      const q=p.getPointAtLength(len*i/samples);
      const d=Math.hypot(q.x-local.x,q.y-local.y);
      if(d<bestD){bestD=d;best=p;}
    }
  }
  return bestD<48 ? best : null;
}

svg.addEventListener("mousemove",e=>{
  if(!completed) return;
  paths.forEach(p=>p.classList.remove("hovered"));
  const p=nearestPath(e.clientX,e.clientY);
  if(p) p.classList.add("hovered");
});
svg.addEventListener("mouseleave",()=>{
  paths.forEach(p=>p.classList.remove("hovered"));
});

prepare();
requestAnimationFrame(draw);
document.querySelectorAll(".placeholder").forEach(a=>a.addEventListener("click",e=>e.preventDefault()));
document.getElementById("year").textContent=new Date().getFullYear();


// Portfolio navigation + section reveal
const navLinks=[...document.querySelectorAll('.site-header nav a[href^="#"]')];
const navSections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);

function updateActiveNav(){
  const y=window.scrollY + 140;
  let current='';
  for(const section of navSections){
    if(section.offsetTop<=y) current=section.id;
  }
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));
}
window.addEventListener('scroll',updateActiveNav,{passive:true});
window.addEventListener('load',updateActiveNav);

const aboutSection=document.querySelector('#about');
const otherRevealSections=[...document.querySelectorAll('.reveal-section')].filter(el=>el!==aboutSection);

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
otherRevealSections.forEach(el=>revealObserver.observe(el));

/* About: replay photo/title/text animation every time the section is re-entered. */
let aboutRunToken=0;
let aboutTimers=[];

function clearAboutTimers(){
  aboutTimers.forEach(clearTimeout);
  aboutTimers=[];
}

function wait(ms){
  return new Promise(resolve=>{
    const id=setTimeout(resolve,ms);
    aboutTimers.push(id);
  });
}

async function typeAboutParagraph(el,text,runToken,speed=8){
  el.textContent='';
  el.classList.add('is-typing');
  const chars=[...text];

  for(let i=0;i<chars.length;i++){
    if(runToken!==aboutRunToken) return;
    el.textContent+=chars[i];
    await new Promise(resolve=>{
      const id=setTimeout(resolve,speed);
      aboutTimers.push(id);
    });
  }

  el.classList.remove('is-typing');
}

async function runAboutSequence(){
  if(!aboutSection) return;

  aboutRunToken++;
  const token=aboutRunToken;
  clearAboutTimers();

  aboutSection.classList.remove('about-active');
  void aboutSection.offsetWidth;
  aboutSection.classList.add('about-active');

  const paragraphs=[...aboutSection.querySelectorAll('.about-typed')];
  paragraphs.forEach(p=>{
    p.textContent='';
    p.classList.remove('is-typing');
  });

  /* Photo + kicker + title arrive first. */
  await wait(1250);
  if(token!==aboutRunToken) return;

  /* Then the body copy types in sequentially. */
  for(const p of paragraphs){
    if(token!==aboutRunToken) return;
    await typeAboutParagraph(p,p.dataset.text || '',token,7);
    await wait(135);
  }
}

function resetAboutSequence(){
  if(!aboutSection) return;

  aboutRunToken++;
  clearAboutTimers();
  aboutSection.classList.remove('about-active');

  aboutSection.querySelectorAll('.about-typed').forEach(p=>{
    p.textContent='';
    p.classList.remove('is-typing');
  });
}

if(aboutSection){
  const aboutObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        runAboutSequence();
      }else{
        resetAboutSequence();
      }
    });
  },{
    threshold:.26,
    rootMargin:'-7% 0px -18% 0px'
  });

  aboutObserver.observe(aboutSection);
}


/* =========================================================
   Aircraft quote loop
   Types on viewport entry, stays visible 5s, fades, waits 1.5s,
   then repeats while the contact section remains in view.
   ========================================================= */

const aircraftQuote = document.querySelector('.aircraft-quote');
const aircraftContact = document.querySelector('#contact');

if (aircraftQuote && aircraftContact) {
  let aircraftQuoteToken = 0;
  let aircraftQuoteActive = false;
  let aircraftQuoteTimer = null;

  const waitAircraft = (ms) => new Promise(resolve => {
    aircraftQuoteTimer = setTimeout(resolve, ms);
  });

  async function typeAircraftQuote(token) {
    const text = aircraftQuote.dataset.text || '';
    aircraftQuote.textContent = '';
    aircraftQuote.classList.remove('is-fading', 'is-visible');
    aircraftQuote.classList.add('is-typing');

    for (const ch of [...text]) {
      if (!aircraftQuoteActive || token !== aircraftQuoteToken) return;
      aircraftQuote.textContent += ch;
      await waitAircraft(34);
    }

    if (!aircraftQuoteActive || token !== aircraftQuoteToken) return;

    aircraftQuote.classList.remove('is-typing');
    aircraftQuote.classList.add('is-visible');

    await waitAircraft(5000);
    if (!aircraftQuoteActive || token !== aircraftQuoteToken) return;

    aircraftQuote.classList.remove('is-visible');
    aircraftQuote.classList.add('is-fading');

    await waitAircraft(1700);
    if (!aircraftQuoteActive || token !== aircraftQuoteToken) return;

    aircraftQuote.textContent = '';
    aircraftQuote.classList.remove('is-fading');

    await waitAircraft(1500);
  }

  async function runAircraftQuoteLoop() {
    aircraftQuoteToken++;
    const token = aircraftQuoteToken;

    while (aircraftQuoteActive && token === aircraftQuoteToken) {
      await typeAircraftQuote(token);
    }
  }

  function stopAircraftQuoteLoop() {
    aircraftQuoteActive = false;
    aircraftQuoteToken++;
    if (aircraftQuoteTimer) clearTimeout(aircraftQuoteTimer);
    aircraftQuote.textContent = '';
    aircraftQuote.classList.remove('is-typing', 'is-visible', 'is-fading');
  }

  const aircraftQuoteObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!aircraftQuoteActive) {
          aircraftQuoteActive = true;
          runAircraftQuoteLoop();
        }
      } else {
        stopAircraftQuoteLoop();
      }
    });
  }, {
    threshold: 0.28,
    rootMargin: '-5% 0px -10% 0px'
  });

  aircraftQuoteObserver.observe(aircraftContact);
}
