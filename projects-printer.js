(() => {
  const mount = document.getElementById("projects-printer");
  if (!mount) return;

  mount.innerHTML = `
  <svg viewBox="0 0 450 320" role="img" aria-label="Interactive isometric wireframe 3D printer printing a Benchy boat">
    <defs>
      <clipPath id="benchyBuildClip">
        <rect id="benchyClipRect" x="152" y="254" width="120" height="0"></rect>
      </clipPath>
      <clipPath id="bedTopClip">
        <polygon points="118,216 309,216 352,242 159,242"></polygon>
      </clipPath>
    </defs>

    <!-- REAR COLUMN DEPTH -->
    <polygon class="frame-face-dark" points="92,60 103,54 103,225 92,231"></polygon>
    <polygon class="frame-face-dark" points="335,58 346,64 346,231 335,225"></polygon>

    <!-- TOP EXTRUSION: top / front / underside -->
    <polygon class="frame-face-light" points="103,50 326,50 339,57 115,57"></polygon>
    <polygon class="frame-face-mid" points="92,60 103,50 115,57 104,66"></polygon>
    <polygon class="frame-face-mid" points="326,50 339,57 346,64 335,58"></polygon>
    <polygon class="frame-face-dark" points="104,66 335,58 335,66 104,74"></polygon>

    <!-- VERTICAL EXTRUSIONS -->
    <polygon class="frame-face-light" points="92,60 104,66 104,225 92,231"></polygon>
    <polygon class="frame-face-mid" points="104,66 112,62 112,220 104,225"></polygon>

    <polygon class="frame-face-light" points="335,58 346,64 346,231 335,225"></polygon>
    <polygon class="frame-face-mid" points="327,62 335,58 335,225 327,220"></polygon>

    <!-- GANTRY RAIL -->
    <polygon class="frame-face-light" points="108,101 326,101 331,105 113,105"></polygon>
    <polygon class="frame-face-mid" points="113,105 331,105 331,111 113,111"></polygon>
    <polygon class="frame-face-dark" points="108,101 113,105 113,111 108,107"></polygon>

    <!-- BELT -->
    <path class="edge-soft" d="M118 108 L322 108" stroke-dasharray="3 4"></path>

    <!-- LEFT Z SCREW -->
    <path class="edge-soft" d="M98 80 L98 217" stroke-dasharray="1.4 3.2"></path>
    <circle class="accent-dark" cx="98" cy="78" r="2.2"></circle>

    <!-- RIGHT Z SCREW -->
    <path class="edge-soft" d="M340 80 L340 217" stroke-dasharray="1.4 3.2"></path>
    <circle class="accent-dark" cx="340" cy="78" r="2.2"></circle>

    <!-- PRINT BED TOP -->
    <polygon class="bed-top" points="118,216 309,216 352,242 159,242"></polygon>
    <!-- bed side thickness -->
    <polygon class="bed-side" points="159,242 352,242 352,249 159,249"></polygon>
    <polygon class="bed-side" points="309,216 352,242 352,249 309,223"></polygon>
    <polygon class="bed-side" points="118,216 159,242 159,249 118,223"></polygon>

    <!-- BED GRID -->
    <g class="edge-back" clip-path="url(#bedTopClip)">
      <path d="M133 213 L177 246"></path>
      <path d="M164 213 L208 246"></path>
      <path d="M195 213 L239 246"></path>
      <path d="M226 213 L270 246"></path>
      <path d="M257 213 L301 246"></path>
      <path d="M288 213 L332 246"></path>
      <path d="M113 223 L329 223"></path>
      <path d="M124 230 L340 230"></path>
      <path d="M138 237 L350 237"></path>
    </g>

    <!-- BASE FEET / LOWER FRAME -->
    <polygon class="frame-face-mid" points="90,234 112,245 112,261 90,250"></polygon>
    <polygon class="frame-face-mid" points="335,233 351,241 351,256 335,248"></polygon>
    <polygon class="frame-face-dark" points="112,245 334,245 351,256 127,256"></polygon>
    <polygon class="frame-face-light" points="112,256 334,256 334,265 112,265"></polygon>

    <!-- CONTROL BOX -->
    <polygon class="frame-face-light" points="279,233 329,233 341,240 291,240"></polygon>
    <polygon class="frame-face-mid" points="291,240 341,240 341,254 291,254"></polygon>
    <polygon class="frame-face-dark" points="279,233 291,240 291,254 279,247"></polygon>
    <rect class="screen-fill" x="300" y="243" width="23" height="7" rx="1"></rect>
    <circle class="accent-face" cx="332" cy="247" r="2.4"></circle>

    <!-- FILAMENT SPOOL -->
    <ellipse class="frame-face-dark" cx="364" cy="113" rx="17" ry="34"></ellipse>
    <ellipse class="frame-face-mid" cx="364" cy="113" rx="11" ry="27"></ellipse>
    <ellipse class="accent-dark" cx="364" cy="113" rx="4.5" ry="14"></ellipse>
    <path class="edge-soft" d="M353 87 C334 67 312 70 300 92"></path>

    <!-- PRINT HEAD -->
    <g id="printHead">
      <!-- rear body -->
      <polygon class="frame-face-dark" points="195,91 231,91 238,96 202,96"></polygon>
      <!-- side face -->
      <polygon class="frame-face-mid" points="231,91 238,96 238,124 231,120"></polygon>
      <!-- front body -->
      <rect class="frame-face-light" x="195" y="91" width="36" height="29" rx="2"></rect>

      <!-- fan / front face -->
      <circle class="teal-face" cx="213" cy="105.5" r="9.3"></circle>
      <circle class="edge-soft" cx="213" cy="105.5" r="4.7"></circle>
      <path class="edge-soft" d="M213 97 L213 114 M205 105.5 L221 105.5"></path>

      <!-- orange carriage accents -->
      <polygon class="accent-face" points="191,97 195,94 195,117 191,114"></polygon>
      <polygon class="accent-face" points="231,96 235,99 235,119 231,117"></polygon>

      <!-- hotend -->
      <polygon class="frame-face-mid" points="205,120 221,120 218,132 208,132"></polygon>
      <polygon class="accent-dark" points="210,132 216,132 214.5,140 211.5,140"></polygon>
      <path class="active-line" d="M213 140 L213 144"></path>
      <circle class="nozzle-glow" cx="213" cy="144" r="3.3"></circle>

      <!-- top cable bundle -->
      <path class="edge-soft" d="M202 91 C199 82 203 76 210 72"></path>
      <path class="edge-soft" d="M207 91 C204 81 208 75 215 71"></path>
    </g>

    <!-- print footprint glow -->
    <ellipse class="build-glow" cx="215" cy="219" rx="56" ry="10"></ellipse>

    <!-- BENCHY -->
    <g id="benchyBuild" clip-path="url(#benchyBuildClip)">
      <!-- partial shaded faces -->
      <path class="teal-face" d="M163 213 L173 226 L244 226 L260 212 L250 211 L244 216 L179 216 L174 211 Z"></path>
      <path class="frame-face-dark" d="M173 226 L182 233 L237 233 L244 226 Z"></path>
      <path class="frame-face-mid" d="M190 213 L190 190 L237 190 L245 213 Z"></path>
      <path class="frame-face-light" d="M196 190 L200 176 L229 176 L235 190 Z"></path>

      <!-- wireframe perimeter -->
      <g class="boat-line">
        <path d="M163 213 L173 226 L244 226 L260 212 L250 211 L244 216 L179 216 L174 211 Z"></path>
        <path d="M173 226 L182 233 L237 233 L244 226"></path>
        <path d="M181 220 C198 225 227 225 246 220"></path>

        <path d="M190 213 L190 190 L237 190 L245 213"></path>
        <path d="M196 190 L200 176 L229 176 L235 190"></path>
        <path d="M197 176 L194 171 L235 171 L231 176"></path>
        <path d="M203 171 L203 159 L214 159 L214 171"></path>
        <path d="M205 159 L205 153 L212 153 L212 159"></path>

        <path d="M204 181 L212 181 L212 189 L202 189 Z"></path>
        <path d="M220 181 L228 181 L231 189 L220 189 Z"></path>
        <path d="M194 196 L207 196 L207 209 L194 209 Z"></path>
        <path d="M237 194 L243 199 L246 210"></path>
        <path d="M184 213 L248 213"></path>
      </g>

      <!-- interior depth lines -->
      <g class="edge-soft">
        <path d="M182 233 L186 236 L235 236 L237 233"></path>
        <path d="M245 216 L249 219 L259 216"></path>
        <path d="M235 190 L239 193 L247 213"></path>
        <path d="M200 176 L204 179 L229 179"></path>
      </g>
    </g>

    <!-- active deposited layer -->
    <path id="activeLayer" class="active-line" d="M170 220 C188 216 230 216 251 220"></path>

    <!-- completed falling Benchy -->
    <g id="fallingBoat" opacity="0">
      <path class="teal-face" d="M163 213 L173 226 L244 226 L260 212 L250 211 L244 216 L179 216 L174 211 Z"></path>
      <path class="frame-face-dark" d="M173 226 L182 233 L237 233 L244 226 Z"></path>
      <g class="boat-line">
        <path d="M163 213 L173 226 L244 226 L260 212 L250 211 L244 216 L179 216 L174 211 Z"></path>
        <path d="M173 226 L182 233 L237 233 L244 226"></path>
        <path d="M190 213 L190 190 L237 190 L245 213"></path>
        <path d="M196 190 L200 176 L229 176 L235 190"></path>
        <path d="M197 176 L194 171 L235 171 L231 176"></path>
        <path d="M203 171 L203 159 L214 159 L214 171"></path>
        <path d="M205 159 L205 153 L212 153 L212 159"></path>
      </g>
    </g>

    <!-- invisible hover zone -->
    <rect class="hover-zone" x="62" y="28" width="340" height="260"></rect>
  </svg>`;

  const svg = mount.querySelector("svg");
  const clipRect = svg.querySelector("#benchyClipRect");
  const printHead = svg.querySelector("#printHead");
  const activeLayer = svg.querySelector("#activeLayer");
  const fallingBoat = svg.querySelector("#fallingBoat");
  const hoverZone = svg.querySelector(".hover-zone");

  let targetSpeed = 0;
  let speed = 0;
  let progress = 0.09;
  let phase = "printing";
  let phaseClock = 0;
  let last = performance.now();

  const printSecondsAtFullSpeed = 16.5;
  const buildBottom = 233;
  const buildTop = 151;
  const buildHeight = buildBottom - buildTop;

  function setRunning(on){
    targetSpeed = on ? 1 : 0;
    mount.classList.toggle("is-running", on);
  }

  hoverZone.addEventListener("mouseenter", () => setRunning(true));
  hoverZone.addEventListener("mouseleave", () => setRunning(false));
  hoverZone.addEventListener("pointerenter", () => setRunning(true));
  hoverZone.addEventListener("pointerleave", () => setRunning(false));
  hoverZone.addEventListener("click", () => setRunning(targetSpeed < .5));

  function updatePrint(dt, now){
    const response = targetSpeed > speed ? 5.0 : 2.1;
    speed += (targetSpeed - speed) * (1 - Math.exp(-response * dt));
    if (speed < 0.0005) speed = 0;

    progress += (dt / printSecondsAtFullSpeed) * speed;
    if (progress >= 1){
      progress = 1;
      phase = "hold";
      phaseClock = 0;
    }

    const h = buildHeight * progress;
    const y = buildBottom - h;
    clipRect.setAttribute("y", y.toFixed(2));
    clipRect.setAttribute("height", h.toFixed(2));

    const sweep = (now * 0.0019 * Math.max(.16, speed)) % 2;
    const tri = sweep <= 1 ? sweep : 2 - sweep;

    const xShift = -42 + tri * 84;
    const zMicro = Math.sin(now * .012) * .65 * speed;
    const headY = Math.max(0, y - 144 + zMicro);
    printHead.setAttribute("transform", `translate(${xShift.toFixed(2)} ${headY.toFixed(2)})`);

    const x1 = 176 + tri * 29;
    const x2 = 252 - tri * 22;
    activeLayer.setAttribute(
      "d",
      `M${x1.toFixed(1)} ${y.toFixed(1)} C196 ${(y-2.2).toFixed(1)} 230 ${(y-2.2).toFixed(1)} ${x2.toFixed(1)} ${y.toFixed(1)}`
    );
    activeLayer.style.opacity = speed > .02 ? "1" : ".32";
  }

  function updateCycle(dt){
    phaseClock += dt;

    if (phase === "hold"){
      speed += (0 - speed) * (1 - Math.exp(-4 * dt));
      activeLayer.style.opacity = "0";

      if (phaseClock > .58){
        fallingBoat.setAttribute("opacity", "1");
        phase = "falling";
        phaseClock = 0;
      }
      return;
    }

    if (phase === "falling"){
      const t = Math.min(1, phaseClock / 1.28);
      const ease = t * t;
      const y = ease * 102;
      const x = t * 9;
      const rot = t * 9.5;
      const opacity = t < .62 ? 1 : Math.max(0, 1 - (t-.62)/.38);

      fallingBoat.setAttribute(
        "transform",
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)} 215 220)`
      );
      fallingBoat.setAttribute("opacity", opacity.toFixed(3));

      if (t > .72){
        const clear = (t - .72) / .28;
        clipRect.setAttribute("height", String(buildHeight * (1-clear)));
        clipRect.setAttribute("y", String(buildTop + buildHeight * clear));
      }

      if (t >= 1){
        phase = "reset";
        phaseClock = 0;
      }
      return;
    }

    if (phase === "reset"){
      fallingBoat.setAttribute("opacity","0");
      fallingBoat.removeAttribute("transform");
      progress = .025;
      clipRect.setAttribute("y", String(buildBottom - buildHeight*progress));
      clipRect.setAttribute("height", String(buildHeight*progress));
      phase = "printing";
      phaseClock = 0;
    }
  }

  function frame(now){
    const dt = Math.min(.05, (now - last) / 1000);
    last = now;

    if (phase === "printing") updatePrint(dt, now);
    else updateCycle(dt);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
