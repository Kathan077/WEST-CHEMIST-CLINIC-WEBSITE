"use client";
import React, { useState, useEffect, useRef } from 'react';
import './PrivateServices.css';
import { API_URL } from '@/config';

const privateServices = [
    { 
        title: "Period Delay Service", 
        cat: "Specialist", 
        color: "#4B2D71",
        img: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&q=80",
        desc: "Clinically safe period delay treatment prescribed by our pharmacists." 
    },
    { 
        title: "Weight Loss Management", 
        cat: "Wellness", 
        color: "#008473",
        img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80",
        desc: "Medically supervised weight management programmes tailored to you." 
    },
    { 
        title: "Ear Wax Removal", 
        cat: "Clinical", 
        color: "#206B5E",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
        desc: "Safe and effective microsuction ear wax removal for clear hearing." 
    },
    { 
        title: "Cryotherapy", 
        cat: "Clinical", 
        color: "#7859A3",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
        desc: "Precise cryotherapy treatment for skin lesions and viral warts." 
    },
    { 
        title: "Travel Clinic", 
        cat: "Specialist", 
        color: "#4B2D71",
        img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
        desc: "Expert travel health advice, malaria tablets and vaccinations." 
    }
];

export default function PrivateServices() {
    const listRef = useRef(null);
    const [services, setServices] = useState(privateServices);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && json.data.length > 0) {
                    const privateSrvs = json.data.filter(s => s.parentCategory === 'Private Services');
                    if (privateSrvs.length > 0) {
                        setServices(privateSrvs);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch services: ", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ps_revealed');
                }
            });
        }, { threshold: 0.1 });

        const cards = listRef.current?.querySelectorAll('.ps_card');
        if (cards) {
            cards.forEach(card => observer.observe(card));
        }

        return () => observer.disconnect();
    }, [services]);

    const getImgUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80';
        if (img.startsWith('/uploads')) return `${API_URL}${img}`;
        return img;
    };

    return (
        <section className="ps_section">
            <div className="ps_container">
                <div className="ps_header">
                    <span className="ps_eyebrow">Private Healthcare</span>
                    <h2 className="ps_title">Personalised Clinical Solutions</h2>
                    <p className="ps_desc">Period delay, weight loss management, ear wax removal, cryotherapy and travel clinic — premium private treatments delivered by qualified pharmacists.</p>
                </div>

                <div className="ps_grid" ref={listRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="ps_card" 
                            key={idx} 
                            style={{ 
                                '--delay': `${idx * 0.1}s`,
                                '--bg': s.color || '#4B2D71'
                            }}
                        >
                            <div className="ps_img_wrap">
                                <img src={getImgUrl(s.img)} alt={s.title} className="ps_img" />
                                <div className="ps_tag">{s.cat}</div>
                            </div>
                            <div className="ps_info">
                                <h3 className="ps_card_title">{s.title}</h3>
                                <p className="ps_card_desc">{s.desc}</p>
                                <div className="ps_actions">
                                    <button 
                                        className="ps_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug || s.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="ps_btn_book"
                                        onClick={() => window.location.href = `/book-appointment?service=${encodeURIComponent(s.title)}`}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

}
