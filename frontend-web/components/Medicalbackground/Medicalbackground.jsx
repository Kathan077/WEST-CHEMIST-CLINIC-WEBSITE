"use client";
import { useEffect, useRef } from "react";

const COLORS = {
  purple:  [75,  45,  113],
  teal:    [32,  107, 94 ],
  accent:  [0,   132, 115],
  lpurple: [120, 89,  163],
  lgreen:  [119, 156, 140],
};
const ALL = Object.values(COLORS);

export default function MedicalBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, frame = 0, animId;
    let particles = [], blobs = [];

    const initBlobs = () => {
      blobs = [
        { bx: W*.10, by: H*.20, r: W*.25, c: COLORS.lpurple },
        { bx: W*.85, by: H*.70, r: W*.30, c: COLORS.teal    },
        { bx: W*.50, by: H*.50, r: W*.20, c: COLORS.accent  },
        { bx: W*.20, by: H*.80, r: W*.18, c: COLORS.lgreen  },
        { bx: W*.90, by: H*.15, r: W*.20, c: COLORS.purple  },
      ];
    };

    const initParticles = () => {
      particles = Array.from({ length: 55 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.3 - 0.05,
        r: Math.random() * 2 + 0.6,
        c: ALL[i % ALL.length],
        a: Math.random() * 0.3 + 0.08,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const drawBlobs = (t) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      blobs.forEach((b, i) => {
        const x = b.bx + Math.sin(t * 0.4 + i) * W * 0.05;
        const y = b.by + Math.cos(t * 0.3 + i) * H * 0.04;
        const [r, g, bl] = b.c;
        const gd = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        gd.addColorStop(0,   `rgba(${r},${g},${bl},.07)`);
        gd.addColorStop(0.5, `rgba(${r},${g},${bl},.025)`);
        gd.addColorStop(1,   `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = gd;
        ctx.fillRect(0, 0, W, H);
      });
    };

    const drawDots = () => {
      const s = 38;
      for (let x = s; x < W; x += s)
        for (let y = s; y < H; y += s) {
          ctx.beginPath();
          ctx.arc(x, y, 0.75, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(75,45,113,.06)";
          ctx.fill();
        }
    };

    const drawLines = (t) => {
      [
        [0, H*.35, W*.25, H*.12, W*.60, H*.55, W, H*.30, COLORS.lpurple, .055],
        [0, H*.65, W*.30, H*.85, W*.60, H*.40, W, H*.70, COLORS.teal,    .055],
        [0, H*.10, W*.45, H*.30, W*.70, H*.15, W, H*.50, COLORS.accent,  .035],
      ].forEach(([sx,sy,c1x,c1y,c2x,c2y,ex,ey,c,a], i) => {
        const [r,g,b] = c;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx, sy + Math.sin(t * 0.5 + i) * 18);
        ctx.bezierCurveTo(
          c1x, c1y + Math.sin(t * 0.4 + i + 1) * 22,
          c2x, c2y + Math.cos(t * 0.3 + i) * 18,
          ex,  ey  + Math.sin(t * 0.6 + i) * 14
        );
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawParticles = (t) => {
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * 0.4 + p.p) * 0.1;
        p.p += 0.01;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        const a = p.a * (0.7 + 0.3 * Math.sin(p.p));
        const [r,g,b] = p.c;
        const gd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        gd.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        gd.addColorStop(1, "transparent");
        ctx.fillStyle = gd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawDNA = (t) => {
      const cx = W * 0.93, sp = 28, amp = 28;
      const tot = Math.floor(H / sp) + 2;
      for (let i = 0; i < tot; i++) {
        const y = (i * sp + (frame * 0.55) % (H + sp * 2)) - sp;
        const ph = (i / tot) * Math.PI * 6 + t * 1.4;
        const x1 = cx + Math.sin(ph) * amp;
        const x2 = cx + Math.sin(ph + Math.PI) * amp;
        const a = 0.1 + 0.18 * Math.abs(Math.sin(ph));
        ctx.beginPath(); ctx.arc(x1, y, 2.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(75,45,113,${a*1.5})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y, 2.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(32,107,94,${a})`; ctx.fill();
        if (i % 2 === 0) {
          ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(0,132,115,${a*.45})`;
          ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
    };

    const loop = () => {
      const t = frame * 0.008; frame++;
      drawBlobs(t); drawDots(); drawLines(t); drawParticles(t); drawDNA(t);
      animId = requestAnimationFrame(loop);
    };

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles(); initBlobs();
    };

    window.addEventListener("resize", resize);
    resize(); loop();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}