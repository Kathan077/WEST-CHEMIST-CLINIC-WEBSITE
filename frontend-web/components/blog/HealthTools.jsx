"use client";
import React from 'react';
import './HealthTools.css';

const tools = [
    { 
        title: "BMI Calculator", 
        icon: (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="6" />
                <path d="M12 12l3-3" />
            </svg>
        ), 
        desc: "Check your Body Mass Index in seconds." 
    },
    { 
        title: "Diabetes Risk", 
        icon: (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7z" />
            </svg>
        ), 
        desc: "Take a simple test to assess your risk factor." 
    },
    { 
        title: "Heart Age", 
        icon: (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        ), 
        desc: "Evaluate your cardiovascular health profile." 
    },
    { 
        title: "Symptom Checker", 
        icon: (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <path d="M11 8v6M8 11h6" />
            </svg>
        ), 
        desc: "Get instant guidance on common symptoms." 
    }
];

export default function HealthTools() {
    const gridRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ht_reveal_visible');
                }
            });
        }, { threshold: 0.1 });

        const cards = gridRef.current.querySelectorAll('.ht_card');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    };

    const handleMouseLeave = (card) => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    return (
        <section className="ht_section">
            <div className="ht_container">
                <div className="ht_header">
                    <h2 className="ht_title">Interactive Health Tools</h2>
                    <p className="ht_subtitle">Free tools to help you monitor and understand your wellbeing.</p>
                </div>
                <div className="ht_grid" ref={gridRef}>
                    {tools.map((tool, idx) => (
                        <div 
                            className="ht_card" 
                            key={idx}
                            style={{ '--delay': `${idx * 0.1}s` }}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                        >
                            <div className="ht_card_inner">
                                <div className="ht_icon_shell">{tool.icon}</div>
                                <h3 className="ht_card_title">{tool.title}</h3>
                                <p className="ht_card_desc">{tool.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
