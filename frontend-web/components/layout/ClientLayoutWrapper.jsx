"use client";

import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MedicalBackground from "@/components/common/MedicalBackground";
import SmoothScroll from "@/components/common/SmoothScroll";

export default function ClientLayoutWrapper({ children }) {
  return (
    <SmoothScroll>
      <MedicalBackground />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
