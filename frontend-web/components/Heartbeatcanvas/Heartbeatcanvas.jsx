"use client";
import { useEffect, useRef } from "react";

const SEG = [0,0,0,0,0,-14,6,-11,18,11,-6,0,0,0,0,0,0,0,0,0];

export default function HeartbeatCanvas({ width = 168, height = 36, color = "#206B5E", glow = "#008473" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }); // Performance hint
    let offset = 0, animId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Optimized Glow: Draw a wider, translucent line instead of using shadowBlur
      ctx.beginPath();
      ctx.strokeStyle = glow;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < width; i++) {
        const pos = (i + offset) % (SEG.length * 9);
        const si  = Math.floor(pos / 9);
        const tl  = (pos % 9) / 9;
        const v1  = SEG[si % SEG.length];
        const v2  = SEG[(si + 1) % SEG.length];
        const y   = height / 2 + v1 + (v2 - v1) * tl;
        i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Main Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 1.0;
      for (let i = 0; i < width; i++) {
        const pos = (i + offset) % (SEG.length * 9);
        const si  = Math.floor(pos / 9);
        const tl  = (pos % 9) / 9;
        const v1  = SEG[si % SEG.length];
        const v2  = SEG[(si + 1) % SEG.length];
        const y   = height / 2 + v1 + (v2 - v1) * tl;
        i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
      }
      ctx.stroke();

      offset += 1.4;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [width, height, color, glow]);

  return <canvas ref={ref} width={width} height={height} style={{ imageRendering: "auto" }} />;
}