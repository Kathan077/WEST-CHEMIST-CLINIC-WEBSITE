"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API_URL, getImageUrl } from '@/config';
import './NHSServices.css';

const DEFAULT_NHS_SERVICES = [
    {
        _id: 'nhs-1',
        title: 'Uncomplicated UTI',
        cat: 'NHS Pharmacy First',
        desc: 'NHS consultation & treatment for lower urinary tract infections in women aged 16-64 without GP referral.',
        slug: 'uncomplicated-uti-treatment',
        img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
        color: '#008473'
    },
    {
        _id: 'nhs-2',
        title: 'Shingles Treatment',
        cat: 'NHS Pharmacy First',
        desc: 'Rapid clinical assessment and prescription antiviral medication for shingles in adults aged 18 and over.',
        slug: 'shingles-treatment',
        img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80',
        color: '#4B2D71'
    },
    {
        _id: 'nhs-3',
        title: 'Sore Throat Service',
        cat: 'NHS Pharmacy First',
        desc: 'Clinical examination and antibiotic prescribing for bacterial throat infections under NHS Pharmacy First.',
        slug: 'sore-throat-service',
        img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80',
        color: '#008473'
    },
    {
        _id: 'nhs-4',
        title: 'Earache & Ear Infection',
        cat: 'NHS Pharmacy First',
        desc: 'Otoscopic ear examination and treatment for acute middle ear infections in children aged 1-17 years.',
        slug: 'acute-otitis-media-service',
        img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
        color: '#4B2D71'
    },
    {
        _id: 'nhs-5',
        title: 'Sinusitis Relief',
        cat: 'NHS Pharmacy First',
        desc: 'Professional nasal and sinus evaluation with prescription sprays or antibiotics for persistent sinusitis.',
        slug: 'sinusitis-service',
        img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
        color: '#008473'
    },
    {
        _id: 'nhs-6',
        title: 'Infected Insect Bites',
        cat: 'NHS Pharmacy First',
        desc: 'Clinical assessment of insect bites and immediate prescription antibiotic treatment for infected skin areas.',
        slug: 'infected-insect-bites',
        img: 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80',
        color: '#4B2D71'
    }
];

const isWeightLoss = (s) => {
    const slug = (s.slug || '').toLowerCase();
    return slug === 'wegovy' || slug === 'mounjaro' || slug === 'wegovy-pills';
};

export default function NHSServices() {
    const gridRef = useRef(null);
    const [services, setServices] = useState(DEFAULT_NHS_SERVICES);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    const nhs = json.data.filter(s => (s.parentCategory || '').toLowerCase().includes('nhs') && !isWeightLoss(s));
                    if (nhs.length > 0) {
                        setServices(nhs);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch NHS services: ", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ns_revealed');
                }
            });
        }, { threshold: 0.1 });

        const items = gridRef.current?.querySelectorAll('.ns_card');
        if (items) {
            items.forEach(item => observer.observe(item));
        }

        return () => observer.disconnect();
    }, [services]);

    return (
        <section className="ns_section">
            <div className="ns_container">
                <div className="ns_header">
                    <div className="ns_branding_bar">
                        <img 
                            src="/images/passport.jpg" 
                            alt="NHS Logo" 
                            className="ns_nhs_logo" 
                        />
                        <div className="ns_brand_divider" />
                        <img 
                            src="/images/pMTyQAHrivzPxrADq_fYE2BCVPz6zSg2WrYdv7FaCDwK7EcNXZ-f8WaevsLxA58Vf_4CCm6fySbw0a9-tNJVSo2UrJlYwXbIC3aNQqNNw5fD9Y2G2kamoUsMMvMVWODtZUiTKKQ.jpg" 
                            alt="NHS Pharmacy First" 
                            className="ns_pf_logo" 
                        />
                    </div>
                    <span className="ns_eyebrow">Official NHS Healthcare Partner</span>
                    <h2 className="ns_title">NHS Pharmacy First Services</h2>
                    <p className="ns_desc">
                        Get expert advice and treatment directly from our qualified pharmacists for common health conditions  no GP appointment or referral required.
                    </p>
                </div>

                <div className="ns_grid" ref={gridRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="ns_card ns_revealed" 
                            key={s._id || idx}
                            style={{ 
                                '--bg': s.color || (idx % 2 === 0 ? '#008473' : '#4B2D71'),
                                '--delay': `${idx * 0.1}s`
                            }}
                        >
                            <div className="ns_card_bottom">
                                <img 
                                    src={getImageUrl(s.img) || s.img} 
                                    alt={s.title} 
                                    className="ns_image" 
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80'; }}
                                />
                                <div className="ns_image_gradient" />
                            </div>
                            <div className="ns_card_top">
                                <div className="ns_meta">
                                    <span className="ns_cat">{s.cat || 'NHS Pharmacy First'}</span>
                                </div>
                                <h3 className="ns_card_title">{s.title}</h3>
                                <p className="ns_card_desc">{s.desc}</p>
                                <div className="ns_actions">
                                    <button 
                                        className="ns_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug}`}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="ns_btn_book"
                                        onClick={() => window.location.href = `/book-appointment?service=${encodeURIComponent(s.title)}`}
                                    >
                                        Book Consultation
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


