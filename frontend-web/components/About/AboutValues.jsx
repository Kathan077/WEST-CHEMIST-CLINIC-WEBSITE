"use client";

import React, { useEffect } from 'react';
import './AboutValues.css';

export default function AboutWhy() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('med_animate');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.med_why_item, .med_why_center, .med_connecting_line').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="med_why_bg">
            <div className="med_why_header">
                <h2>Our Core Values</h2>
                <div className="med_divider_dots">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div className="med_why_container">

                {/* SVG Connecting Lines */}
                <svg className="med_connection_svg" width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                    <path className="med_connecting_line med_cl_tl" d="M500,250 L250,90" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                    <path className="med_connecting_line med_cl_tr" d="M500,250 L750,90" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                    <path className="med_connecting_line med_cl_bl" d="M500,250 L250,410" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                    <path className="med_connecting_line med_cl_br" d="M500,250 L750,410" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                </svg>

                <div className="med_why_center">
                    <div className="med_pulse_ring"></div>
                    <div className="med_pulse_ring ring2"></div>
                    <div className="med_center_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 16 16">
                            <path d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9z"/>
                            <path d="M.88 8C-2.427 1.68 4.41-2 7.823 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8z"/>
                        </svg>
                    </div>
                </div>

                <div className="med_why_item med_w_top_left">
                    <div className="med_why_icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <div className="med_why_text">
                        <h4>Compassion</h4>
                        <p className="med_why_desc">We deliver empathetic, respectful healthcare that focuses on your physical and emotional well-being.</p>
                    </div>
                </div>

                <div className="med_why_item med_w_top_right">
                    <div className="med_why_icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div className="med_why_text">
                        <h4>Trust</h4>
                        <p className="med_why_desc">We build lasting, transparent relationships through clear communication and clinical excellence.</p>
                    </div>
                </div>

                <div className="med_why_item med_w_bot_left">
                    <div className="med_why_icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </div>
                    <div className="med_why_text">
                        <h4>Excellence</h4>
                        <p className="med_why_desc">We strive for exceptional quality in every diagnosis, treatment, and patient consultation.</p>
                    </div>
                </div>

                <div className="med_why_item med_w_bot_right">
                    <div className="med_why_icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m9 12 2 2 4-4"/>
                        </svg>
                    </div>
                    <div className="med_why_text">
                        <h4>Integrity</h4>
                        <p className="med_why_desc">We uphold the highest ethical and clinical standards to ensure safe, honest medical guidance.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}