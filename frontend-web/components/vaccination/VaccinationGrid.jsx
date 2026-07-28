"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './VaccinationGrid.css';

const VACCINE_SLUGS = [
    'vaccine-meningitis',
    'nhs-meningitis-b',
    'chickenpox-vaccine',
    'vaccine-chikungunya',
    'nhs-shingles',
    'hpv-vaccine',
    'vaccine-rabies',
    'vaccine-hepatitis-b',
    'vaccine-typhoid',
    'vaccine-japanese-encephalitis'
];

const VaccinationGrid = () => {
    const gridRef = useRef(null);
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    const vaccServices = json.data.filter(s => 
                        (s.parentCategory || '').toLowerCase() === 'vaccination services' ||
                        VACCINE_SLUGS.includes(s.slug)
                    );
                    setVaccines(vaccServices);
                }
            } catch (err) {
                console.error("Error fetching vaccines:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVaccines();
    }, []);

    useEffect(() => {
        if (!gridRef.current || loading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('pro_reveal_active');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = gridRef.current.querySelectorAll('.pro_grid_card');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [loading, vaccines]);

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--t3)' }}>
                <h3>Loading vaccinations...</h3>
            </div>
        );
    }

    return (
        <section id="vacc_grid" className="vacc_grid_pro_section" ref={gridRef}>
            <div className="vacc_grid_pro_bg"></div>
            
            <div className="vacc_grid_pro_container">
                <div className="vacc_grid_pro_header">
                    <span className="vacc_section_badge">Our Protocols</span>
                    <h2>Premium Vaccinations</h2>
                    <p>Discover our comprehensive suite of advanced clinical immunizations.</p>
                </div>

                <div className="vacc_grid_pro_wrapper">
                    {vaccines.map((item, index) => (
                        <div 
                            className="pro_grid_card" 
                            key={item._id || index}
                            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                        >
                            <div className="pro_card_visual">
                                <div className="pro_card_tag">{item.cat || 'Vaccination'}</div>
                                <img 
                                    src={getImageUrl(item.img)} 
                                    alt={item.title} 
                                    className="pro_card_img" 
                                    loading="lazy" 
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80'; }}
                                />
                                <div className="pro_card_gradient_overlay"></div>
                            </div>
                            
                            <div className="pro_card_content">
                                <h3>{item.title}</h3>
                                <p className="pro_card_desc">{item.desc}</p>
                                
                                <div className="pro_card_actions">
                                    <Link href={`/services/${item.slug}`} className="pro_btn_outline">
                                        More Info
                                    </Link>
                                    <Link href={`/book-appointment?service=${encodeURIComponent(item.title)}`} className="pro_btn_solid">
                                        Book Now
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VaccinationGrid;
