"use client";

import React, { useEffect, useRef } from 'react';
import './Abouthero.css';

export default function AboutHero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;
            const elements = heroRef.current.querySelectorAll('.med_float_stat');
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;

            elements.forEach((el, index) => {
                const multiplier = index % 2 === 0 ? 1 : -1;
                el.style.transform = `translate3d(${x * multiplier}px, ${y * multiplier}px, 0)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="med_hero" ref={heroRef}>
            
            {/* Animated Background Mesh */}
            <div className="med_hero_bg_glow"></div>
            <div className="med_hero_bg_glow med_glow_secondary"></div>

            <div className="med_h_content">
                <div className="med_h_badge_container">
                    <span className="med_h_badge">
                        <span className="med_badge_dot"></span>
                        Our Story
                    </span>
                </div>

                <h1 className="med_h_title">
                    <span className="med_word_reveal">About</span> 
                    <span className="med_word_reveal">West</span> 
                    <span className="med_word_reveal">Chemist</span> 
                    <br/>
                    <span className="med_word_reveal med_gradient_text">Clinic</span>
                </h1>
                
                <p className="med_h_desc">
                    By providing world-class medical facilities, experts, and<br/>
                    innovation — making world-class healthcare accessible.
                </p>
                
                <div className="med_h_actions">
                    <button className="med_btn_primary">
                        <span className="med_btn_text">Book an Appointment</span>
                        <div className="med_btn_hover_wave"></div>
                    </button>
                </div>
            </div>

            {/* Parallax Floating Stats */}
            <div className="med_float_stat med_stat_left">
                <div className="med_stat_inner">
                    <h3>1946+</h3>
                    <span>Patients Helped</span>
                </div>
            </div>
            
            <div className="med_float_stat med_stat_right">
                <div className="med_stat_inner">
                    <h3>1451+</h3>
                    <span>Specialists</span>
                </div>
            </div>
            
            <div className="med_float_stat med_stat_bottom_left">
                <div className="med_stat_inner">
                    <h3>2000+</h3>
                    <span>Years Experience</span>
                </div>
            </div>

            <div className="med_float_stat med_stat_bottom_right">
                <div className="med_stat_inner">
                    <h3>1500+</h3>
                    <span>Successful Surgeries</span>
                </div>
            </div>
        </section>
    );
}
