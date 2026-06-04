"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './CTASection.css';

export default function CTASection() {
    const sectionRef = useRef(null);

    // Deep scroll reveal
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('cta_visible');
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        const els = sectionRef.current?.querySelectorAll('.cta_reveal') ?? [];
        els.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, []);

    // Magnetic button animation
    const handleMouse = (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };

    const handleLeave = (e) => {
        const btn = e.currentTarget;
        btn.style.transform = 'translate(0px, 0px)';
    };

    return (
        <section className="cta_mega_section" ref={sectionRef}>
            
            {/* Background glowing orbs for "bada" premium feel */}
            <div className="cta_glow_blob blob_1"></div>
            <div className="cta_glow_blob blob_2"></div>

            <div className="cta_container">
                
                <h2 className="cta_title cta_reveal" style={{'--delay': '0ms'}}>
                    Ready to take the next step?
                </h2>
                
                <div className="cta_buttons_wrap">
                    <div className="cta_reveal" style={{'--delay': '150ms'}}>
                        <Link 
                            href="/book-appointment" 
                            className="cta_btn cta_solid"
                            onMouseMove={handleMouse}
                            onMouseLeave={handleLeave}
                        >
                            <span>Book Free Consultation</span>
                            <div className="cta_btn_shine"></div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
