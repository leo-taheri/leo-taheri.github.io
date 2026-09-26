
const paths=[...document.querySelectorAll(".trace-line")];
const callouts=[...document.querySelectorAll(".callout")];
const point=document.querySelector(".white-plot-point");
const title=document.querySelector(".drawing-title");
const svg=document.querySelector(".engine-svg");

const DRAW_MS=32000;
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
