"use client";
import React, { useEffect, useRef } from 'react';
import './BlogHero.css';

export default function BlogHero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bh_active');
                }
            });
        }, { threshold: 0.1 });

        if (heroRef.current) observer.observe(heroRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="bh_section" ref={heroRef}>
            {/* Ambient Background Elements */}
            <div className="bh_ambient">
                <div className="bh_light_orb orb_1" />
                <div className="bh_light_orb orb_2" />
                <div className="bh_pattern_overlay" />
            </div>

            <div className="bh_container">
                <div className="bh_main_grid">
                    {/* Left: Content Side */}
                    <div className="bh_content_side">
                        <div className="bh_badge">
                            <span className="bh_badge_dot" />
                            FEATURED ARTICLE
                        </div>
                        
                        <h1 className="bh_main_title">
                            Digital <span className="bh_highlight">Health</span> 
                            & Medical <span className="bh_highlight">Innovation</span>
                        </h1>
                        
                        <p className="bh_main_desc">
                            Insights from the intersection of pharmaceutical expertise and modern wellness. 
                            Stay ahead with clinical advice that matters for your daily life.
                        </p>
                        
  

                    </div>

                    {/* Right: Visual Side */}
                    <div className="bh_visual_side">
                        <div className="bh_image_canvas">
                            <div className="bh_img_frame">
                                <img 
                                    src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?w=1200&q=80" 
                                    alt="Health Innovation" 
                                    className="bh_hero_img" 
                                />
                                <div className="bh_glass_overlay" />
                            </div>
                            
                            {/* Pro Space Floating Card */}
                            <div className="bh_floating_stat">
                                <div className="bh_stat_icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <div className="bh_stat_text">
                                    <strong>Medically Verified</strong>
                                    <span>By Clinical Team</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
           
        </section>
    );
}
