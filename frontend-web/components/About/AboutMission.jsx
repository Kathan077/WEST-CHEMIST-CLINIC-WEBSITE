"use client";

import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/config';
import './AboutMission.css';

// SVG Icon Helper mapping icon string to JSX SVG
const renderCardIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
        case 'mission':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
            );
        case 'vision':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                </svg>
            );
        case 'values':
        case 'our values':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            );
        default:
            // Healthcare cross default icon
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
            );
    }
};

export default function AboutMission() {
    const containerRef = useRef(null);
    const [cards, setCards] = useState([
        {
            title: 'Mission',
            content: 'To deliver timely prescription dispensing, expert travel health, and accessible pharmacy services through a compassionate, patient-centered team dedicated to your family’s well-being.',
            icon: 'mission'
        },
        {
            title: 'Vision',
            content: 'To remain the most trusted community pharmacy partner across every stage of life, empowering patients with expert guidance, reliable care, and total peace of mind.',
            icon: 'vision'
        },
        {
            title: 'Our Values',
            content: 'At West Chemist, we are guided by compassion, PHARMACY integrity, and community trust. We know medication management can feel overwhelming, so we treat every patient with warmth, respect, and personalized care.',
            icon: 'values'
        }
    ]);

    useEffect(() => {
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const cardItems = data.data.filter(item => item.type === 'card');
                    if (cardItems.length > 0) {
                        setCards(cardItems);
                    }
                }
            })
            .catch(err => console.error('Error fetching about cards content:', err));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('med_animate');
                }
            });
        }, { threshold: 0.2 });

        if (containerRef.current) {
            containerRef.current.querySelectorAll('.med_card_wrapper').forEach(el => observer.observe(el));
        }
        return () => observer.disconnect();
    }, [cards]);

    const handleMouseMove = (e, wrapperElem) => {
        const cardElem = wrapperElem.querySelector('.med_card');
        if (!cardElem) return;

        const rect = wrapperElem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        cardElem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = (e, wrapperElem) => {
        const cardElem = wrapperElem.querySelector('.med_card');
        if (cardElem) {
            cardElem.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    };

    return (
        <section className="med_mission_bg">
            <div className="med_mission_container" ref={containerRef}>
                {cards.map((card, index) => {
                    // Alternate colors/designs. The second card is typically filled
                    const isFilled = index === 1; 
                    const delayClass = index === 0 ? '' : index === 1 ? 'med_card_wrapper_delayed_1' : 'med_card_wrapper_delayed_2';

                    return (
                        <div
                            key={card._id || index}
                            className={`med_card_wrapper ${delayClass}`}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMouseLeave(e, e.currentTarget)}
                        >
                            <div className={`med_card ${isFilled ? 'med_card_filled' : ''}`}>
                                <div className="med_card_icon">
                                    {renderCardIcon(card.icon)}
                                </div>
                                <h3>{card.title}</h3>
                                <p>{card.content}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
