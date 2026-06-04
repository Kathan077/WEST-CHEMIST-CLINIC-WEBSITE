"use client";
import { memo } from "react";
import MedicalCanvas from "./MedicalCanvas";
import "./MedicalBackground.css";

const MedicalBackground = () => {
  return (
    <div className="medical-bg-container">
      {/* Layer 1: GOD-LEVEL Canvas — 6 medical symbols + 3 depth layers */}
      <MedicalCanvas />

      {/* Layer 2: Pro-Level Moving Orbs — 5 CSS spheres */}
      <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
      </div>

      {/* Layer 3: Medical dot grid */}
      <div className="medical-grid-fixed" />

      {/* Layer 4: HUD scan beam */}
      <div className="hud-scan" />

      {/* Layer 5: ECG accent */}
      <div className="ecg-container">
        <div className="ecg-line" />
      </div>

      {/* Layer 6: Glass vignette */}
      <div className="glass-overlay" />
    </div>
  );
};

export default memo(MedicalBackground);
