"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '@/config';
import './NHSServices.css';

const allServices = [
    { 
        title: "Ear Ache Treatment", 
        cat: "Pharmacy First", 
        color: "#4B2D71",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
        desc: "Treatment and advice for ear ache in children aged 1–17 years." 
    },
    { 
        title: "Impetigo Treatment", 
        cat: "Pharmacy First", 
        color: "#008473",
        img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80",
        desc: "Clinically assessed and treated impetigo without a GP visit." 
    },
    { 
        title: "Infected Insect Bites", 
        cat: "Pharmacy First", 
        color: "#206B5E",
        img: "https://plus.unsplash.com/premium_photo-1661266858277-226e6d15a51a?w=600&q=80",
        desc: "Fast treatment for infected insect bites and stings." 
    },
    { 
        title: "Shingles Treatment", 
        cat: "Pharmacy First", 
        color: "#7859A3",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
        desc: "Early antiviral treatment for shingles to reduce severity." 
    },
    { 
        title: "Sinusitis Treatment", 
        cat: "Pharmacy First", 
        color: "#4B2D71",
        img: "https://plus.unsplash.com/premium_photo-1663040149075-8178a9c4038a?w=600&q=80",
        desc: "Assessment and treatment of acute sinusitis symptoms." 
    },
    { 
        title: "Sore Throat Treatment", 
        cat: "Pharmacy First", 
        color: "#008473",
        img: "https://plus.unsplash.com/premium_photo-1661339116345-217646ba4c81?w=600&q=80",
        desc: "Rapid strep testing and treatment for sore throats." 
    },
    { 
        title: "UTI Treatment", 
        cat: "Pharmacy First", 
        color: "#206B5E",
        img: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=600&q=80",
        desc: "Urinary tract infection assessment and antibiotic prescribing." 
    },
    { 
        title: "Blood Pressure Testing", 
        cat: "NHS Service", 
        color: "#7859A3",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
        desc: "Free NHS blood pressure checks and hypertension monitoring." 
    },
    { 
        title: "Contraception Service", 
        cat: "NHS Service", 
        color: "#4B2D71",
        img: "https://plus.unsplash.com/premium_photo-1661633534346-601931818296?w=600&q=80",
        desc: "Contraception and emergency contraception advice and supply." 
    },
    { 
        title: "Flu Vaccination", 
        cat: "NHS & Private", 
        color: "#008473",
        img: "https://plus.unsplash.com/premium_photo-1663040228302-3c87f0b8307d?w=600&q=80",
        desc: "NHS and private seasonal flu vaccinations for all eligible patients." 
    },
    { 
        title: "Covid Vaccination", 
        cat: "NHS & Private", 
        color: "#206B5E",
        img: "https://plus.unsplash.com/premium_photo-1661633465809-562725a3818e?w=600&q=80",
        desc: "NHS and private Covid-19 vaccinations and boosters." 
    },
    { 
        title: "Meningitis B Vaccination", 
        cat: "NHS & Private", 
        color: "#7859A3",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
        desc: "NHS and private Meningitis B vaccination for eligible patients." 
    }
];

export default function NHSServices() {
    const gridRef = useRef(null);
    const [services, setServices] = useState(allServices);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
                    const dbMap = {};
                    json.data.forEach(s => {
                        if (s.title) dbMap[s.title.toLowerCase().trim()] = s;
                        if (s.slug) dbMap[s.slug.toLowerCase().trim()] = s;
                    });

                    // Filter all NHS Services & Pharmacy First services
                    const nhs = json.data.filter(s => 
                        s.parentCategory === 'NHS Services (Pharmacy First)' || 
                        s.parentCategory === 'Pharmacy First' ||
                        (s.parentCategory && s.parentCategory.includes('NHS')) ||
                        s.cat === 'Pharmacy First'
                    );

                    if (nhs.length > 0) {
                        setServices(nhs);
                    } else {
                        // Merge static fallback with DB images if available
                        setServices(allServices.map(s => {
                            const match = dbMap[s.title.toLowerCase().trim()];
                            return match ? { ...s, img: match.img || s.img, desc: match.desc || s.desc, slug: match.slug } : s;
                        }));
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

    const getImgUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80';
        if (img.startsWith('/uploads')) return `${API_URL}${img}`;
        return img;
    };

    return (
        <section className="ns_section">
            <div className="ns_container">
                <div className="ns_header">
                    <span className="ns_eyebrow">Professional Pharma Care</span>
                    <h2 className="ns_title">NHS Pharmacy Services</h2>
                    <p className="ns_desc">Explore our NHS Pharmacy First services, vaccination programmes, blood pressure checks, and contraception services — all available without a GP referral.</p>
                </div>

                <div className="ns_grid" ref={gridRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="ns_card" 
                            key={idx}
                            style={{ 
                                '--bg': idx % 2 === 0 ? '#008473' : '#4B2D71',
                                '--delay': `${idx * 0.1}s`
                            }}
                        >
                            <div className="ns_card_bottom">
                                <img src={getImgUrl(s.img)} alt={s.title} className="ns_image" />
                                <div className="ns_image_gradient" />
                            </div>
                            <div className="ns_card_top">
                                <div className="ns_meta">
                                    <span className="ns_cat">{s.cat}</span>
                                </div>
                                <h3 className="ns_card_title">{s.title}</h3>
                                <p className="ns_card_desc">{s.desc}</p>
                                <div className="ns_actions">
                                    <button 
                                        className="ns_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug || s.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="ns_btn_book"
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

