"use client";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  MEDICAL NETWORK HYBRID BACKGROUND
//  = Professional molecular network  +  floating medical symbols
//  Award-winning clinic aesthetic — Zero lag · No shadowBlur
// ═══════════════════════════════════════════════════════════

const CLR = {
  node:   [75, 45, 113],  // Purple
  link:   [0, 132, 115],  // Teal
  pulse:  [32, 107, 94],  // Green
  symbol: [120, 89, 163], // Lighter Purple
};

// ─── Network Nodes ───────────────────────────────────────

class NetNode {
  constructor(w, h) {
    this.x  = Math.random() * w;
    this.y  = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r  = Math.random() * 1.2 + 1.5;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = Math.random() * 0.01 + 0.005;
    this.baseAlpha  = Math.random() * 0.25 + 0.1;
  }
  update(w, h) {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += this.phaseSpeed;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
    this.x = Math.max(0, Math.min(w, this.x));
    this.y = Math.max(0, Math.min(h, this.y));
  }
  get alpha() { return this.baseAlpha * (0.7 + 0.3 * Math.sin(this.phase)); }
}

// ─── Medical Symbol Drawers ──────────────────────────────

function drawCross(ctx, x, y, sz, alpha) {
  const arm = sz, t = sz * 0.4;
  const c = CLR.symbol;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
  ctx.beginPath(); ctx.roundRect(x - t/2, y - arm/2, t, arm, 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x - arm/2, y - t/2, arm, t, 2); ctx.fill();
  ctx.restore();
}

function drawPill(ctx, x, y, sz, rot, alpha) {
  const c = CLR.symbol;
  const w = sz * 2.2, h = sz * 0.8;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.roundRect(-w/2, -h/2, w, h, h/2); ctx.stroke();
  ctx.globalAlpha = alpha * 0.4;
  ctx.beginPath(); ctx.moveTo(0, -h/2); ctx.lineTo(0, h/2); ctx.stroke();
  ctx.restore();
}

function drawHex(ctx, x, y, sz, rot, alpha) {
  const c = CLR.symbol;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI/3)*i - Math.PI/6;
    i===0 ? ctx.moveTo(sz*Math.cos(a), sz*Math.sin(a))
          : ctx.lineTo(sz*Math.cos(a), sz*Math.sin(a));
  }
  ctx.closePath(); ctx.stroke();
  ctx.restore();
}

function drawDNA(ctx, x, y, sz, phase, alpha) {
  const c  = CLR.symbol;
  const c2 = CLR.link;
  const steps = 8, h = sz * 4;
  ctx.save();
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cy = y - h/2 + t * h;
    const amp = sz * 0.8;
    const x1 =  Math.sin(phase + t * Math.PI * 2) * amp;
    const x2 = -Math.sin(phase + t * Math.PI * 2) * amp;
    if (i > 0) {
      const prevT  = (i-1)/steps, prevCy = y - h/2 + prevT*h;
      const prevX1 =  Math.sin(phase + prevT*Math.PI*2)*amp;
      const prevX2 = -Math.sin(phase + prevT*Math.PI*2)*amp;
      ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
      ctx.beginPath(); ctx.moveTo(x+prevX1, prevCy); ctx.lineTo(x+x1, cy); ctx.stroke();
      ctx.strokeStyle = `rgba(${c2[0]},${c2[1]},${c2[2]},1)`;
      ctx.beginPath(); ctx.moveTo(x+prevX2, prevCy); ctx.lineTo(x+x2, cy); ctx.stroke();
    }
    if (i%2===0) {
      ctx.globalAlpha = alpha * 0.25;
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
      ctx.beginPath(); ctx.moveTo(x+x1, cy); ctx.lineTo(x+x2, cy); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawECG(ctx, x, y, sz, alpha) {
  const c    = CLR.symbol;
  const segs = [0,0,0,-2,5,-3,0,0,0,0];
  const len  = sz * 4;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const t  = i/len;
    const si = Math.floor(t*(segs.length-1));
    const fr = t*(segs.length-1) - si;
    const py = y + (segs[si] + (segs[si+1]-segs[si])*fr) * sz * 0.5;
    const px = x - len/2 + i;
    i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.stroke();
  ctx.restore();
}

// ─── Medical Symbol Particle ─────────────────────────────

const SYM_TYPES = ["CROSS","PILL","HEX","DNA","ECG"];

class MedSymbol {
  constructor(w, h) { this.w=w; this.h=h; this.reset(true); }
  reset(init=false) {
    this.x     = Math.random() * this.w;
    this.y     = init ? Math.random()*this.h : this.h + 80;
    this.vx    = (Math.random()-0.5)*0.15;
    this.vy    = -(Math.random()*0.1 + 0.03);
    this.sz    = Math.random()*8 + 6;
    this.rot   = Math.random()*Math.PI*2;
    this.rotV  = (Math.random()-0.5)*0.008;
    this.phase = Math.random()*Math.PI*2;
    this.phaseSpeed = Math.random()*0.006+0.002;
    this.breathT = Math.random()*Math.PI*2;
    this.breathSpeed = Math.random()*0.01+0.004;
    this.baseAlpha = Math.random()*0.15+0.05;
    this.type  = SYM_TYPES[Math.floor(Math.random()*SYM_TYPES.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    this.phase += this.phaseSpeed;
    this.breathT += this.breathSpeed;
    if (this.y < -120) this.reset(false);
    if (this.x < -150) this.x = this.w + 100;
    if (this.x > this.w+150) this.x = -100;
  }
  get alpha() { return this.baseAlpha * (0.7+0.3*Math.sin(this.breathT)); }
  draw(ctx) {
    const {x,y,sz,rot,phase,type} = this;
    const a = this.alpha;
    switch(type) {
      case "CROSS": drawCross(ctx,x,y,sz,a); break;
      case "PILL":  drawPill (ctx,x,y,sz,rot,a); break;
      case "HEX":   drawHex  (ctx,x,y,sz,rot,a); break;
      case "DNA":   drawDNA  (ctx,x,y,sz,phase,a); break;
      case "ECG":   drawECG  (ctx,x,y,sz,a); break;
    }
  }
}

// ─── Main Component ──────────────────────────────────────

export default function MedicalCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d", { alpha: true });
    let animId;
    let netNodes = [], medSymbols = [];
    let W=0, H=0;
    
    let particleScale = 1;
    let connectDist = 160;

    const [nr,ng,nb] = CLR.node;
    const [lr,lg,lb] = CLR.link;
    const [pr,pg,pb] = CLR.pulse;

    const init = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      
      const isMobile = W < 768;
      particleScale = isMobile ? 0.5 : 1;
      connectDist = isMobile ? 120 : 160;

      const nodeCount = isMobile ? 24 : 55;
      const symbolCount = isMobile ? 12 : 30;

      netNodes  = Array.from({length:nodeCount}, () => new NetNode(W, H));
      medSymbols = Array.from({length:symbolCount}, () => new MedSymbol(W, H));
    };

    const drawLinks = () => {
      for (let i=0; i<netNodes.length; i++) {
        for (let j=i+1; j<netNodes.length; j++) {
          const dx = netNodes[i].x - netNodes[j].x;
          const dy = netNodes[i].y - netNodes[j].y;
          const d  = Math.sqrt(dx*dx+dy*dy);
          if (d < connectDist) {
            const s = 1 - d/connectDist;
            ctx.beginPath();
            ctx.moveTo(netNodes[i].x, netNodes[i].y);
            ctx.lineTo(netNodes[j].x, netNodes[j].y);
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${s*0.12})`;
            ctx.lineWidth   = s * 1.2;
            ctx.stroke();
          }
        }
      }
    };

    const drawNetNode = (node, isPulse) => {
      const a = node.alpha;
      // Mouse interaction
      const dx = node.x - mouse.current.x;
      const dy = node.y - mouse.current.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const force = dist < 200 ? (200 - dist) / 200 : 0;
      
      const nx = node.x + (dx/dist || 0) * force * 15;
      const ny = node.y + (dy/dist || 0) * force * 15;

      const r = isPulse ? node.r * 1.8 : node.r;
      if (isPulse) {
        for (let ring=3; ring>=1; ring--) {
          ctx.beginPath();
          ctx.arc(nx, ny, r + ring*3.5, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${a*0.04/ring})`;
          ctx.fill();
        }
      }
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI*2);
      ctx.fillStyle = isPulse
        ? `rgba(${pr},${pg},${pb},${Math.min(a*1.2,0.8)})`
        : `rgba(${nr},${ng},${nb},${a})`;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      drawLinks();

      netNodes.forEach((n, i) => {
        n.update(W, H);
        drawNetNode(n, i % 10 === 0);
      });

      medSymbols.forEach(s => {
        s.update();
        s.draw(ctx);
      });

      animId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    init();
    animate();

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
    />
  );
}
