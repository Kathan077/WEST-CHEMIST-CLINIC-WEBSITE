 "use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL } from '@/config';
import './CTASection.css';

const DEFAULT_CTA = {
    title: 'Ready to take the next step?',
    ctaText: 'Book Now',
    ctaUrl: '/book-appointment'
};

export default function CTASection() {
    const sectionRef = useRef(null);
    const [ctaData, setCtaData] = useState(DEFAULT_CTA);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/homepage`);
                const json = await res.json();
                if (json.success && json.data && json.data.footerCta) {
                    const sec = json.data.footerCta;
                    setCtaData({
                        title: sec.title || DEFAULT_CTA.title,
                        ctaText: sec.ctaText || DEFAULT_CTA.ctaText,
                        ctaUrl: sec.ctaUrl || DEFAULT_CTA.ctaUrl
                    });
                }
            } catch (err) {
                console.error("Failed to load footerCta CMS details:", err);
            }
        };
        loadCMS();
    }, []);

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
    }, [ctaData]);

    // Magnetic button animation
    const handleMouse = (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
    };

    const handleLeave = (e) => {
        const btn = e.currentTarget;
        btn.style.transform = 'translate3d(0px, 0px, 0)';
    };

    return (
        <section className="cta_mega_section" ref={sectionRef}>
            
            {/* Background glowing orbs */}
            <div className="cta_glow_blob blob_1"></div>
            <div className="cta_glow_blob blob_2"></div>

            <div className="cta_container">
                
                <h2 className="cta_title cta_reveal" style={{'--delay': '0ms'}}>
                    {ctaData.title}
                </h2>
                
                <div className="cta_buttons_wrap">
                    <div className="cta_reveal" style={{'--delay': '150ms'}}>
                        <Link 
                            href={ctaData.ctaUrl || "/book-appointment"} 
                            className="cta_btn cta_solid"
                            onMouseMove={handleMouse}
                            onMouseLeave={handleLeave}
                        >
                            <span>{ctaData.ctaText}</span>
                            <div className="cta_btn_shine"></div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
