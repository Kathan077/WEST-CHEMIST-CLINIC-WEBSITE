"use client";
import React, { useEffect, useRef } from 'react';
import './PrivateServices.css';

const privateServices = [
    { 
        title: "Blood Testing", 
        cat: "Diagnostic", 
        color: "#4B2D71",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
        desc: "Comprehensive blood analysis for various health markers." 
    },
    { 
        title: "Earwax Removal", 
        cat: "Clinical", 
        color: "#008473",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
        desc: "Safe and effective microsuction for clear hearing." 
    },
    { 
        title: "Travel Clinic", 
        cat: "Specialist", 
        color: "#FF6B35",
        img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
        desc: "Expert travel health advice and vaccinations." 
    },
    { 
        title: "Cryotherapy", 
        cat: "Clinical", 
        color: "#2D5A27",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
        desc: "Precise treatment for skin lesions and viral warts." 
    },
    { 
        title: "Microneedling", 
        cat: "Aesthetic", 
        color: "#4B2D71",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
        desc: "Advanced skin rejuvenation for a radiant complexion." 
    },
    { 
        title: "Strep A Test & Treat", 
        cat: "Diagnostic", 
        color: "#008473",
        img: "https://plus.unsplash.com/premium_photo-1664303017917-71feb142f30c?w=600&q=80",
        desc: "Rapid testing and same-day treatment for Strep A." 
    }
];

export default function PrivateServices() {
    const listRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ps_revealed');
                }
            });
        }, { threshold: 0.1 });

        const cards = listRef.current.querySelectorAll('.ps_card');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="ps_section">
            <div className="ps_container">
                <div className="ps_header">
                    <span className="ps_eyebrow">Private Healthcare</span>
                    <h2 className="ps_title">Personalised Clinical Solutions</h2>
                    <p className="ps_desc">Premium medical treatments delivered with precision. World-class expertise, available on your schedule.</p>
                </div>

                <div className="ps_grid" ref={listRef}>
                    {privateServices.map((s, idx) => (
                        <div 
                            className="ps_card" 
                            key={idx} 
                            style={{ 
                                '--delay': `${idx * 0.1}s`,
                                '--bg': s.color 
                            }}
                        >
                            <div className="ps_img_wrap">
                                <img src={s.img} alt={s.title} className="ps_img" />
                                <div className="ps_tag">{s.cat}</div>
                            </div>
                            <div className="ps_info">
                                <h3 className="ps_card_title">{s.title}</h3>
                                <p className="ps_card_desc">{s.desc}</p>
                                <div className="ps_actions">
                                    <button 
                                        className="ps_btn_view"
                                        onClick={() => window.location.href = `/services/${s.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="ps_btn_book"
                                        onClick={() => window.location.href = '/book-appointment'}
                                    >
                                        Book Now
                                    </button>
                                </div>
                                <div className="ps_line" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
