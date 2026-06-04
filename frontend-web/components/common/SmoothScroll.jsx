"use strict";
"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Robust Lenis initialization
    const lenis = new Lenis({
      lerp: 0.1, // Smoothness
      wheelMultiplier: 1, // Standard distance
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Ensure the page height is recalculated when content changes
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
    };
  }, []);

  return <div className="smooth-scroll-wrapper">{children}</div>;
}
