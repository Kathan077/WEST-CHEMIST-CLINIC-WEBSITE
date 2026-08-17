"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/config';
import './Abouthero.css';

export default function AboutHero() {
    const heroRef = useRef(null);
    const [heroData, setHeroData] = useState({
        title: 'About West Chemist',
        content: 'Serving our communities for over 20 years, West Chemist is dedicated to providing high-quality prescription medicines, travel health, and personalized patient care. Our team of experienced pharmacists and professional healthcare staff are here to simplify medication management and support you and your family through all stages of life.'
    });
    const [stats, setStats] = useState([
        { title: '15,000+', content: 'Prescriptions Dispensed' },
        { title: '10,000+', content: 'Patients Served' }
    ]);

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
                    const statItems = data.data.filter(item => item.type === 'stat');
                    if (statItems.length > 0) {
                        setStats(statItems.map(s => ({
                            title: s.title,
                            content: s.content
                        })));
                    }
                }
            })
            .catch(err => console.error('Error fetching about hero content:', err));
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;
            const elements = heroRef.current.querySelectorAll('.med_float_stat');
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;

            elements.forEach((el, index) => {
                const multiplier = index % 2 === 0 ? 1 : -1;
                el.style.transform = `translate3d(${x * multiplier}px, ${y * multiplier}px, 0)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
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
                <div className="med_h_badge_container">
                    <span className="med_h_badge">
                        <span className="med_badge_dot"></span>
                        Our Story
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

            {/* Parallax Floating Stats */}
            {stats[0] && (
                <div className="med_float_stat med_stat_left">
                    <div className="med_stat_inner">
                        <h3>{stats[0].title}</h3>
                        <span>{stats[0].content}</span>
                    </div>
                </div>
            )}

            {stats[1] && (
                <div className="med_float_stat med_stat_right">
                    <div className="med_stat_inner">
                        <h3>{stats[1].title}</h3>
                        <span>{stats[1].content}</span>
                    </div>
                </div>
            )}

            {stats[2] && (
                <div className="med_float_stat med_stat_bottom_left">
                    <div className="med_stat_inner">
                        <h3>{stats[2].title}</h3>
                        <span>{stats[2].content}</span>
                    </div>
                </div>
            )}

            {/* Display extra stats if there are more than 3, positioned beautifully */}
            {stats.slice(3).map((stat, index) => (
                <div key={index} className="med_float_stat" style={{
                    position: 'absolute',
                    top: `${40 + (index * 15)}%`,
                    left: `${index % 2 === 0 ? 5 : 85}%`,
                    zIndex: 15
                }}>
                    <div className="med_stat_inner">
                        <h3>{stat.title}</h3>
                        <span>{stat.content}</span>
                    </div>
                </div>
            ))}
        </section>
    );
}
