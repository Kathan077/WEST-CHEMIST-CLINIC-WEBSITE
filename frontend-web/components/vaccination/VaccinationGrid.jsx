"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './VaccinationGrid.css';

const vaccines = [
    {
        title: "Meningitis",
        desc: "Essential protection against meningococcal disease, particularly for travelers and students.",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=800&q=80",
        link: "/services/meningitis-acwy",
        tag: "Premium"
    },
    {
        title: "Rabies",
        desc: "Crucial preemptive immunity for high-risk regions and adventure travel.",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
        link: "/services/rabies-vaccine",
        tag: "Travel"
    },
    {
        title: "Chickenpox",
        desc: "Comprehensive immunity against the varicella virus for all ages.",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=800&q=80",
        link: "/services/travel-vaccinations",
        tag: "Routine"
    },
    {
        title: "Hepatitis",
        desc: "Full-spectrum defense against liver infections from Hepatitis A & B.",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
        link: "/services/hepatitis-b-vaccine",
        tag: "Essential"
    },
    {
        title: "Shingles",
        desc: "Targeted protection against herpes zoster for mature patients.",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=800&q=80",
        link: "/services/shingles-service",
        tag: "Adult"
    },
    {
        title: "HPV",
        desc: "Advanced immunization protocols for comprehensive proactive health.",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=800&q=80",
        link: "/services/travel-vaccinations",
        tag: "Routine"
    },
    {
        title: "Typhoid",
        desc: "Specialized vaccination to prevent typhoid fever during international travel.",
        img: "https://plus.unsplash.com/premium_photo-1663040149075-8178a9c4038a?w=800&q=80",
        link: "/services/typhoid-injection",
        tag: "Travel"
    },
    {
        title: "Japanese Encephalitis",
        desc: "Critical neurological protection for travel to affected Asian destinations.",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
        link: "/services/japanese-encephalitis",
        tag: "Specialist"
    },
    {
        title: "Chikungunya",
        desc: "New-generation defense against mosquito-borne viral infections.",
        img: "https://plus.unsplash.com/premium_photo-1664303017917-71feb142f30c?w=800&q=80",
        link: "/services/travel-vaccinations",
        tag: "New"
    }
];

const VaccinationGrid = () => {
    const gridRef = useRef(null);

    useEffect(() => {
        if (!gridRef.current) return;
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
    }, []);

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
                            key={index}
                            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                        >
                            <div className="pro_card_visual">
                                <div className="pro_card_tag">{item.tag}</div>
                                <img src={item.img} alt={item.title} className="pro_card_img" loading="lazy" />
                                <div className="pro_card_gradient_overlay"></div>
                            </div>
                            
                            <div className="pro_card_content">
                                <h3>{item.title}</h3>
                                <p className="pro_card_desc">{item.desc}</p>
                                
                                <div className="pro_card_actions">
                                    <Link href={item.link} className="pro_btn_outline">
                                        More Info
                                    </Link>
                                    <Link href="/book-appointment" className="pro_btn_solid">
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
