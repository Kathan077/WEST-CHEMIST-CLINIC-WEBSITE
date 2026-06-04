"use client";
import React, { useEffect, useRef } from 'react';
import './NHSServices.css';

const allServices = [
    { 
        title: "Discharge Medicines Service", 
        cat: "Advanced NHS", 
        color: "#4B2D71", // Purple
        img: "https://plus.unsplash.com/premium_photo-1661633534346-601931818296?w=600&q=80",
        desc: "Coordinating your medication after hospital discharge." 
    },
    { 
        title: "Dispensing Appliances", 
        cat: "Essential Care", 
        color: "#008473", // Teal
        img: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=600&q=80",
        desc: "Supply and maintenance of essential medical appliances." 
    },
    { 
        title: "Dispensing Medicines", 
        cat: "Essential Care", 
        color: "#FF6B35", // Orange
        img: "https://plus.unsplash.com/premium_photo-1663040149075-8178a9c4038a?w=600&q=80",
        desc: "Safe and accurate dispensing of prescriptions." 
    },
    { 
        title: "Disposal of Unwanted Medicines", 
        cat: "Essential Care", 
        color: "#2D5A27", // Dark Green
        img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80",
        desc: "Safe disposal of unwanted or expired medication." 
    },
    { 
        title: "Public Health Promotion", 
        cat: "Essential Care", 
        color: "#4B2D71",
        img: "https://plus.unsplash.com/premium_photo-1661266858277-226e6d15a51a?w=600&q=80",
        desc: "Advice on healthy lifestyles and minor ailment management." 
    },
    { 
        title: "Repeat Dispensing", 
        cat: "Essential Care", 
        color: "#008473",
        img: "https://plus.unsplash.com/premium_photo-1661339116345-217646ba4c81?w=600&q=80",
        desc: "Management of your recurring prescriptions." 
    },
    { 
        title: "Support for Self Care", 
        cat: "Essential Care", 
        color: "#FF6B35",
        img: "https://plus.unsplash.com/premium_photo-1661633465809-562725a3818e?w=600&q=80",
        desc: "Guidelines for managing your health independently." 
    },
    { 
        title: "Signposting Service", 
        cat: "Essential Care", 
        color: "#2D5A27",
        img: "https://plus.unsplash.com/premium_photo-1663040228302-3c87f0b8307d?w=600&q=80",
        desc: "Directing you to the most appropriate healthcare provider." 
    },
    { 
        title: "New Medicine Service", 
        cat: "Advanced NHS", 
        color: "#4B2D71",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
        desc: "Support and advice for newly prescribed medications." 
    }
];

export default function NHSServices() {
    const gridRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ns_revealed');
                }
            });
        }, { threshold: 0.1 });

        const items = gridRef.current.querySelectorAll('.ns_card');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="ns_section">
            <div className="ns_container">
                <div className="ns_header">
                    <span className="ns_eyebrow">Professional Pharma Care</span>
                    <h2 className="ns_title">NHS Pharmacy Services</h2>
                    <p className="ns_desc">Explore our 9 essential clinical services designed to support your health and wellbeing within the NHS framework.</p>
                </div>

                <div className="ns_grid" ref={gridRef}>
                    {allServices.map((s, idx) => (
                        <div 
                            className="ns_card" 
                            key={idx}
                            style={{ 
                                '--bg': s.color,
                                '--delay': `${idx * 0.1}s`
                            }}
                        >
                            <div className="ns_card_top">
                                <div className="ns_meta">
                                    <span className="ns_cat">{s.cat}</span>
                                </div>
                                <h3 className="ns_card_title">{s.title}</h3>
                                <p className="ns_card_desc">{s.desc}</p>
                                <div className="ns_actions">
                                    <button 
                                        className="ns_btn_view"
                                        onClick={() => window.location.href = `/services/${s.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    >
                                        View
                                    </button>
                                    <button className="ns_btn_book">Book Now</button>
                                </div>
                            </div>
                            <div className="ns_card_bottom">
                                <img src={s.img} alt={s.title} className="ns_image" />
                                <div className="ns_image_gradient" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
