"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/config';
import './Abouthero.css';

export default function AboutHero() {
    const heroRef = useRef(null);
    const [heroData, setHeroData] = useState({
        title: 'About West Chemist',
        content: 'Serving our communities for over 40 years, West Chemist is dedicated to providing high-quality prescription medicines, travel health, and personalized patient care. Our team of experienced pharmacists and professional healthcare staff are here to simplify medication management and support you and your family through all stages of life.'
    });
    useEffect(() => {
        // Fetch dynamic content from backend
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const heroItem = data.data.find(item => item.type === 'hero');
                    if (heroItem) {
                        setHeroData({
                            title: heroItem.title,
                            content: heroItem.content
                        });
                    }
                }
            })
            .catch(err => console.error('Error fetching about hero content:', err));
    }, []);

    // Split title into words for animated reveal
    const titleWords = heroData.title.split(' ');
    const firstThree = titleWords.slice(0, 3);
    const restOfWords = titleWords.slice(3);

    return (
        <section className="med_hero" ref={heroRef}>
            {/* Animated Background Mesh */}
            <div className="med_hero_bg_glow"></div>
            <div className="med_hero_bg_glow med_glow_secondary"></div>

            <div className="med_h_content">
                <div className="med_h_badge_container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className="med_h_badge">
                        <span className="med_badge_dot"></span>
                        GPhC Reg. No: 1035465
                    </span>
                    <span className="med_h_badge">
                        Superintendent Pharmacist: Viren Bhatia
                    </span>
                </div>

                <h1 className="med_h_title">
                    {firstThree.map((word, idx) => (
                        <span key={idx} className="med_word_reveal">{word} </span>
                    ))}
                    {restOfWords.length > 0 && <br />}
                    {restOfWords.map((word, idx) => (
                        <span key={idx} className="med_word_reveal med_gradient_text">{word} </span>
                    ))}
                </h1>

                <p className="med_h_desc" style={{ whiteSpace: 'pre-wrap' }}>
                    {heroData.content}
                </p>

                <div className="med_h_actions">
                    <Link href="/book-appointment" className="med_btn_primary">
                        <span className="med_btn_text">Book an Appointment</span>
                        <div className="med_btn_hover_wave"></div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
