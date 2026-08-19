"use client";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  MEDICAL NETWORK HYBRID BACKGROUND (GOD LEVEL v2.0)
//  Vibrant molecular network + crisp floating medical symbols
//  High Visibility · Crisp DPR Scaling · Interactive · Zero Lag
// ═══════════════════════════════════════════════════════════

const CLR = {
  purple:  [75,  45,  113], // Brand Primary
  teal:    [0,   132, 115], // Brand Accent
  green:   [32,  107, 94 ], // Brand Secondary
  lpurple: [120, 89,  163], // Soft Purple
  cyan:    [0,   224, 184], // Vibrant Cyan
};

const PALETTE = [CLR.purple, CLR.teal, CLR.green, CLR.lpurple, CLR.cyan];

// ─── Network Nodes ───────────────────────────────────────

class NetNode {
  constructor(w, h) {
    this.x  = Math.random() * w;
    this.y  = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.r  = Math.random() * 0.8 + 1.2;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = Math.random() * 0.01 + 0.004;
    this.baseAlpha  = Math.random() * 0.10 + 0.08; // Subtle visibility
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
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
  get alpha() {
    return this.baseAlpha * (0.7 + 0.3 * Math.sin(this.phase));
  }
}

// ─── Medical Symbol Drawers ──────────────────────────────

function drawCross(ctx, x, y, sz, alpha, color) {
  const arm = sz, t = sz * 0.38;
  const [r, g, b] = color || CLR.purple;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - t/2, y - arm/2, t, arm, 3);
    ctx.roundRect(x - arm/2, y - t/2, arm, t, 3);
  } else {
    ctx.rect(x - t/2, y - arm/2, t, arm);
    ctx.rect(x - arm/2, y - t/2, arm, t);
  }
  ctx.fill();
  ctx.restore();
}

function drawPill(ctx, x, y, sz, rot, alpha, color) {
  const [r, g, b] = color || CLR.teal;
  const w = sz * 2.2, h = sz * 0.85;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(-w/2, -h/2, w, h, h/2);
  } else {
    ctx.rect(-w/2, -h/2, w, h);
  }
  ctx.stroke();
  ctx.fillStyle = `rgba(${r},${g},${b},0.2)`;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -h/2);
  ctx.lineTo(0, h/2);
  ctx.stroke();
  ctx.restore();
}

function drawHex(ctx, x, y, sz, rot, alpha, color) {
  const [r, g, b] = color || CLR.green;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = `rgba(${r},${g},${b},0.85)`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const px = sz * Math.cos(a);
    const py = sz * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  // Inner node dot
  ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
  ctx.beginPath();
  ctx.arc(0, 0, sz * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDNA(ctx, x, y, sz, phase, alpha) {
  const c1 = CLR.purple;
  const c2 = CLR.cyan;
  const steps = 9, h = sz * 4.2;
  ctx.save();
  ctx.lineWidth = 1.6;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cy = y - h / 2 + t * h;
    const amp = sz * 0.85;
    const x1 = Math.sin(phase + t * Math.PI * 2) * amp;
    const x2 = -Math.sin(phase + t * Math.PI * 2) * amp;
    if (i > 0) {
      const prevT = (i - 1) / steps;
      const prevCy = y - h / 2 + prevT * h;
      const prevX1 = Math.sin(phase + prevT * Math.PI * 2) * amp;
      const prevX2 = -Math.sin(phase + prevT * Math.PI * 2) * amp;
      ctx.globalAlpha = alpha * 0.8;
      ctx.strokeStyle = `rgba(${c1[0]},${c1[1]},${c1[2]},0.9)`;
      ctx.beginPath();
      ctx.moveTo(x + prevX1, prevCy);
      ctx.lineTo(x + x1, cy);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${c2[0]},${c2[1]},${c2[2]},0.9)`;
      ctx.beginPath();
      ctx.moveTo(x + prevX2, prevCy);
      ctx.lineTo(x + x2, cy);
      ctx.stroke();
    }
    if (i % 2 === 0) {
      ctx.globalAlpha = alpha * 0.45;
      ctx.strokeStyle = `rgba(${CLR.teal[0]},${CLR.teal[1]},${CLR.teal[2]},0.8)`;
      ctx.beginPath();
      ctx.moveTo(x + x1, cy);
      ctx.lineTo(x + x2, cy);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawECG(ctx, x, y, sz, alpha, color) {
  const [r, g, b] = color || CLR.cyan;
  const segs = [0, 0, 0, -3, 8, -5, 0, 0, 0, 0];
  const len = sz * 4.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const t = i / len;
    const si = Math.floor(t * (segs.length - 1));
    const fr = t * (segs.length - 1) - si;
    const py = y + (segs[si] + (segs[si + 1] - segs[si]) * fr) * sz * 0.45;
    const px = x - len / 2 + i;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSteth(ctx, x, y, sz, alpha, color) {
  const [r, g, b] = color || CLR.lpurple;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.strokeStyle = `rgba(${r},${g},${b},0.85)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, sz * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, sz * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
  ctx.fill();
  ctx.restore();
}

// ─── Medical Symbol Particle ─────────────────────────────

const SYM_TYPES = ["CROSS", "PILL", "HEX", "DNA", "ECG", "STETH"];

class MedSymbol {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset(true);
  }
  reset(init = false) {
    this.x = Math.random() * this.w;
    this.y = init ? Math.random() * this.h : this.h + 80;
    this.vx = (Math.random() - 0.5) * 0.12;
    this.vy = -(Math.random() * 0.08 + 0.03);
    this.sz = Math.random() * 5 + 9; // Soft, small size (9px to 14px)
    this.rot = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.008;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = Math.random() * 0.005 + 0.002;
    this.breathT = Math.random() * Math.PI * 2;
    this.breathSpeed = Math.random() * 0.008 + 0.003;
    this.baseAlpha = Math.random() * 0.09 + 0.07; // Soft ambient visibility
    this.type = SYM_TYPES[Math.floor(Math.random() * SYM_TYPES.length)];
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    this.phase += this.phaseSpeed;
    this.breathT += this.breathSpeed;
    if (this.y < -120) this.reset(false);
    if (this.x < -150) this.x = this.w + 100;
    if (this.x > this.w + 150) this.x = -100;
  }
  get alpha() {
    return this.baseAlpha * (0.75 + 0.25 * Math.sin(this.breathT));
  }
  draw(ctx) {
    const { x, y, sz, rot, phase, type, color } = this;
    const a = this.alpha;
    switch (type) {
      case "CROSS": drawCross(ctx, x, y, sz, a, color); break;
      case "PILL":  drawPill(ctx, x, y, sz, rot, a, color); break;
      case "HEX":   drawHex(ctx, x, y, sz, rot, a, color); break;
      case "DNA":   drawDNA(ctx, x, y, sz, phase, a); break;
      case "ECG":   drawECG(ctx, x, y, sz, a, color); break;
      case "STETH": drawSteth(ctx, x, y, sz, a, color); break;
      default:      drawCross(ctx, x, y, sz, a, color); break;
    }
  }
}

// ─── Main Component ──────────────────────────────────────

export default function MedicalCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let animId;
    let netNodes = [], medSymbols = [];
    let W = 0, H = 0, dpr = 1;
    let connectDist = 120;

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      const isMobile = W < 768;
      connectDist = isMobile ? 80 : 120;

      const nodeCount = isMobile ? 12 : 24;
      const symbolCount = isMobile ? 6 : 12;

      netNodes = Array.from({ length: nodeCount }, () => new NetNode(W, H));
      medSymbols = Array.from({ length: symbolCount }, () => new MedSymbol(W, H));
    };

    const drawLinks = () => {
      for (let i = 0; i < netNodes.length; i++) {
        for (let j = i + 1; j < netNodes.length; j++) {
          const dx = netNodes[i].x - netNodes[j].x;
          const dy = netNodes[i].y - netNodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connectDist) {
            const s = 1 - d / connectDist;
            const [r, g, b] = netNodes[i].color;
            ctx.beginPath();
            ctx.moveTo(netNodes[i].x, netNodes[i].y);
            ctx.lineTo(netNodes[j].x, netNodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${s * 0.08})`;
            ctx.lineWidth = s * 1.0;
            ctx.stroke();
          }
        }
      }
    };

    const drawNetNode = (node, isPulse) => {
      const a = node.alpha;
      const [r, g, b] = node.color;

      // Smooth Mouse Interaction
      const dx = node.x - mouse.current.x;
      const dy = node.y - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = dist < 180 ? (180 - dist) / 180 : 0;

      const nx = node.x + (dx / (dist || 1)) * force * 14;
      const ny = node.y + (dy / (dist || 1)) * force * 14;

      const radius = isPulse ? node.r * 1.5 : node.r;

      if (isPulse) {
        for (let ring = 2; ring >= 1; ring--) {
          ctx.beginPath();
          ctx.arc(nx, ny, radius + ring * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${(a * 0.06) / ring})`;
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.arc(nx, ny, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a * 1.0, 0.35)})`;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      drawLinks();

      netNodes.forEach((n, i) => {
        n.update(W, H);
        drawNetNode(n, i % 8 === 0);
      });

      medSymbols.forEach((s) => {
        s.update();
        s.draw(ctx);
      });

      animId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    init();
    animate();

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

