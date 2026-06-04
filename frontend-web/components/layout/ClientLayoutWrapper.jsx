"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MedicalBackground from "@/components/common/MedicalBackground";
import SmoothScroll from "@/components/common/SmoothScroll";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname && pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="admin-root-container">
        <main className="admin-main">
          {children}
        </main>
      </div>
    );
  }

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
