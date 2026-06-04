"use client";
import React from 'react';
import './HealthTools.css';

const tools = [
    { title: "BMI Calculator", icon: "⚖️", desc: "Check your Body Mass Index in seconds." },
    { title: "Diabetes Risk", icon: "🩸", desc: "Take a simple test to assess your risk factor." },
    { title: "Heart Age", icon: "❤️", desc: "Evaluate your cardiovascular health profile." },
    { title: "Symptom Checker", icon: "🔍", desc: "Get instant guidance on common symptoms." }
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
                                <button className="ht_launch_btn">Launch Tool</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
