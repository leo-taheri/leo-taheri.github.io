const hero = document.querySelector(".hero");
const glow = document.querySelector(".hero-glow");
const cursor = document.querySelector(".custom-cursor");
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let mouse = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.35 };
let heroMouse = { x: 0, y: 0, inside: false };
let nodes = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  const rect = hero.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(28, Math.min(60, Math.floor(rect.width / 24)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12
  }));
}

function drawNetwork() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;

    if (heroMouse.inside) {
      const dx = n.x - heroMouse.x;
      const dy = n.y - heroMouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150 && dist > 0) {
        const force = (150 - dist) / 150;
        n.x += (dx / dist) * force * 0.45;
        n.y += (dy / dist) * force * 0.45;
      }
    }
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 115) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,157,0,${(1 - dist / 115) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,157,0,.34)";
    ctx.fill();
  });

  if (heroMouse.inside) {
    ctx.beginPath();
    ctx.arc(heroMouse.x, heroMouse.y, 44, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,157,0,.16)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(heroMouse.x - 62, heroMouse.y);
    ctx.lineTo(heroMouse.x + 62, heroMouse.y);
    ctx.moveTo(heroMouse.x, heroMouse.y - 62);
    ctx.lineTo(heroMouse.x, heroMouse.y + 62);
    ctx.strokeStyle = "rgba(255,157,0,.08)";
    ctx.stroke();
  }

  requestAnimationFrame(drawNetwork);
}

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  cursor.style.opacity = "1";

  const rect = hero.getBoundingClientRect();
  const inside = e.clientY >= rect.top && e.clientY <= rect.bottom;

  if (inside) {
    heroMouse.x = e.clientX - rect.left;
    heroMouse.y = e.clientY - rect.top;
    heroMouse.inside = true;

    hero.style.setProperty("--mx", `${heroMouse.x}px`);
    hero.style.setProperty("--my", `${heroMouse.y}px`);
  } else {
    heroMouse.inside = false;
  }
});

window.addEventListener("mouseout", () => {
  cursor.style.opacity = "0";
  heroMouse.inside = false;
});

document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "28px";
    cursor.style.height = "28px";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "12px";
    cursor.style.height = "12px";
  });
});

document.querySelectorAll("[data-placeholder-link]").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

resizeCanvas();
drawNetwork();
window.addEventListener("resize", resizeCanvas);
